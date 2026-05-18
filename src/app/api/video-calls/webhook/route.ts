import { NextResponse } from "next/server";
import { getRecording } from "@/lib/video-calls/daily-api";
import { RECORDING_RETENTION_DAYS } from "@/lib/video-calls/types";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type DailyWebhook = {
  type: string;
  payload?: {
    recording_id?: string;
    room_name?: string;
    duration?: number;
  };
};

export async function POST(request: Request) {
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const event = (await request.json()) as DailyWebhook;
  if (event.type !== "recording.ready-to-download") {
    return NextResponse.json({ received: true });
  }

  const recordingId = event.payload?.recording_id;
  if (!recordingId) return NextResponse.json({ received: true });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const rec = await getRecording(recordingId);
  if (!rec.data?.download_link || !rec.data.room_name) {
    return NextResponse.json({ received: true });
  }

  const { data: session } = await admin
    .from("video_call_sessions")
    .select("id")
    .eq("daily_room_id", rec.data.room_name)
    .maybeSingle();

  if (!session) {
    const { data: byUrl } = await admin
      .from("video_call_sessions")
      .select("id, room_url")
      .ilike("room_url", `%${rec.data.room_name}%`)
      .maybeSingle();
    if (!byUrl) return NextResponse.json({ received: true });
    Object.assign(session ?? {}, byUrl);
  }

  const sessionId = session?.id;
  if (!sessionId) return NextResponse.json({ received: true });

  const downloadRes = await fetch(rec.data.download_link);
  if (!downloadRes.ok) {
    return NextResponse.json({ error: "Download failed" }, { status: 502 });
  }

  const buffer = Buffer.from(await downloadRes.arrayBuffer());
  const path = `${sessionId}/${recordingId}.mp4`;

  const { error: uploadError } = await admin.storage
    .from("video-call-recordings")
    .upload(path, buffer, { contentType: "video/mp4", upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + RECORDING_RETENTION_DAYS);

  const { data: publicUrl } = admin.storage.from("video-call-recordings").getPublicUrl(path);

  const { data: existing } = await admin
    .from("video_call_recordings")
    .select("id")
    .eq("session_id", sessionId)
    .in("status", ["processing", "ready"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const row = {
    session_id: sessionId,
    recording_url: publicUrl.publicUrl,
    storage_path: path,
    duration_seconds: rec.data.duration ?? null,
    file_size_bytes: buffer.length,
    status: "ready",
    expires_at: expiresAt.toISOString(),
  };

  if (existing?.id) {
    await admin.from("video_call_recordings").update(row).eq("id", existing.id);
  } else {
    await admin.from("video_call_recordings").insert(row);
  }

  await admin
    .from("video_call_sessions")
    .update({ recording_url: publicUrl.publicUrl })
    .eq("id", sessionId);

  return NextResponse.json({ ok: true });
}
