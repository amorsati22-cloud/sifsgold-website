import { NextResponse } from "next/server";
import { assertSessionAccess, getSessionUser } from "@/lib/video-calls/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: recordings } = await admin
    .from("video_call_recordings")
    .select("*")
    .eq("session_id", sessionId)
    .eq("status", "ready")
    .order("created_at", { ascending: false });

  const recording = recordings?.[0];
  if (!recording?.storage_path) {
    return NextResponse.json({ recordings: recordings ?? [] });
  }

  const { data: signed } = await admin.storage
    .from("video-call-recordings")
    .createSignedUrl(recording.storage_path as string, 3600);

  return NextResponse.json({
    recordings: recordings ?? [],
    download_url: signed?.signedUrl ?? null,
    expires_at: recording.expires_at,
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.isHost) {
    return NextResponse.json({ error: "Only host can delete recordings" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: recordings } = await admin
    .from("video_call_recordings")
    .select("id, storage_path")
    .eq("session_id", sessionId);

  for (const rec of recordings ?? []) {
    if (rec.storage_path) {
      await admin.storage.from("video-call-recordings").remove([rec.storage_path as string]);
    }
    await admin
      .from("video_call_recordings")
      .update({ status: "deleted" })
      .eq("id", rec.id);
  }

  await admin
    .from("video_call_sessions")
    .update({ recording_url: null })
    .eq("id", sessionId);

  return NextResponse.json({ ok: true });
}
