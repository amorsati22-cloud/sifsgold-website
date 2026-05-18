import { NextResponse } from "next/server";
import { getRecording } from "@/lib/video-calls/daily-api";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  if (secret && request.headers.get("authorization") !== "Bearer " + secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await request.json();
  if (event.type !== "recording.ready-to-download") {
    return NextResponse.json({ received: true });
  }

  const recordingId = event.payload?.recording_id;
  const roomName = event.payload?.room_name;
  if (!recordingId || !roomName) return NextResponse.json({ received: true });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream } = await admin
    .from("live_streams")
    .select("id")
    .eq("daily_room_name", roomName)
    .maybeSingle();

  if (!stream) return NextResponse.json({ received: true });

  const rec = await getRecording(recordingId);
  if (!rec.data?.download_link) return NextResponse.json({ received: true });

  const buffer = Buffer.from(await (await fetch(rec.data.download_link)).arrayBuffer());
  const path = "live/" + stream.id + "/" + recordingId + ".mp4";
  await admin.storage.from("stream-recordings").upload(path, buffer, { contentType: "video/mp4", upsert: true });
  const { data: url } = admin.storage.from("stream-recordings").getPublicUrl(path);

  await admin
    .from("live_streams")
    .update({ recording_url: url.publicUrl })
    .eq("id", stream.id);

  return NextResponse.json({ ok: true });
}
