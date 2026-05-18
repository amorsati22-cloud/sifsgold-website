import { NextResponse } from "next/server";
import { assertSessionAccess, getSessionUser } from "@/lib/video-calls/auth";
import {
  createMeetingToken,
  isDailyConfigured,
  roomNameFromUrl,
} from "@/lib/video-calls/daily-api";
import { getRecordingConsentStatus } from "@/lib/video-calls/consent";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: session } = await admin
    .from("video_call_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session?.room_url) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.recording_enabled) {
    const consent = await getRecordingConsentStatus(sessionId);
    if (consent.required && !consent.allConsented && consent.participants.length > 0) {
      return NextResponse.json(
        { error: "All participants must consent to recording before joining", consent },
        { status: 428 },
      );
    }
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { status: "in_progress" };
  if (!session.actual_start) updates.actual_start = now;

  await admin.from("video_call_sessions").update(updates).eq("id", sessionId);

  await admin
    .from("video_call_participants")
    .update({ joined_at: now })
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .is("joined_at", null);

  const supabase = await createClient();
  const { data: profile } = supabase
    ? await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle()
    : { data: null };

  const displayName = profile?.full_name ?? profile?.email ?? "Guest";
  const roomName = roomNameFromUrl(session.room_url as string);
  let token: string | null = null;

  if (isDailyConfigured() && roomName) {
    const tokenRes = await createMeetingToken({
      roomName,
      userId: user.id,
      userName: displayName,
      isOwner: access.isHost,
      enableRecording: Boolean(session.recording_enabled) && access.isHost,
    });
    token = tokenRes.data?.token ?? null;
  }

  return NextResponse.json({
    room_url: session.room_url,
    token,
    session_id: sessionId,
    is_host: access.isHost,
  });
}
