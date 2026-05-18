import { NextResponse } from "next/server";
import { assertSessionAccess, getSessionUser } from "@/lib/video-calls/auth";
import { logParticipantCost } from "@/lib/video-calls/sessions";
import { deleteDailyRoom, roomNameFromUrl } from "@/lib/video-calls/daily-api";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };
type Body = { end_for_all?: boolean };

export async function POST(request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const endForAll = body.end_for_all === true;

  if (endForAll && !access.isHost) {
    return NextResponse.json({ error: "Only host can end call for all" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const now = new Date().toISOString();

  const { data: participant } = await admin
    .from("video_call_participants")
    .select("id, joined_at")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (participant?.joined_at) {
    const joined = new Date(participant.joined_at as string).getTime();
    const durationSeconds = Math.max(0, Math.floor((Date.now() - joined) / 1000));
    await admin
      .from("video_call_participants")
      .update({ left_at: now, duration_seconds: durationSeconds })
      .eq("id", participant.id);
    await logParticipantCost(sessionId, participant.id as string, durationSeconds);
  }

  if (endForAll) {
    const { data: session } = await admin
      .from("video_call_sessions")
      .select("room_url, recording_enabled")
      .eq("id", sessionId)
      .maybeSingle();

    await admin
      .from("video_call_sessions")
      .update({ status: "ended", actual_end: now })
      .eq("id", sessionId);

    if (session?.room_url) {
      const roomName = roomNameFromUrl(session.room_url as string);
      if (roomName) await deleteDailyRoom(roomName);
    }

    if (session?.recording_enabled) {
      await admin.from("video_call_recordings").insert({
        session_id: sessionId,
        recording_url: "pending",
        status: "processing",
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  return NextResponse.json({ ok: true, ended_for_all: endForAll });
}
