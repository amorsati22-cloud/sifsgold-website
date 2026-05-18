import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/video-calls/auth";
import { createVideoCallSession } from "@/lib/video-calls/sessions";
import type { VideoCallSessionType } from "@/lib/video-calls/types";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  title: string;
  description?: string;
  session_type?: VideoCallSessionType;
  scheduled_start: string;
  scheduled_end: string;
  timezone?: string;
  max_participants?: number;
  recording_enabled?: boolean;
  linked_appointment_id?: string;
  linked_brand_deal_id?: string;
  participant_user_ids?: string[];
  participant_emails?: string[];
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: profile } = supabase
    ? await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle()
    : { data: null };

  if (!profile?.user_type || !PRO_USER_TYPES.includes(profile.user_type)) {
    return NextResponse.json({ error: "Pro account required" }, { status: 403 });
  }

  const body = (await request.json()) as Body;
  if (!body.title || !body.scheduled_start || !body.scheduled_end) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await createVideoCallSession({
    hostId: user.id,
    title: body.title,
    description: body.description,
    sessionType: body.session_type ?? "consultation",
    scheduledStart: body.scheduled_start,
    scheduledEnd: body.scheduled_end,
    timezone: body.timezone ?? "America/Chicago",
    maxParticipants: body.max_participants,
    recordingEnabled: body.recording_enabled,
    linkedAppointmentId: body.linked_appointment_id,
    linkedBrandDealId: body.linked_brand_deal_id,
    participantUserIds: body.participant_user_ids,
    participantEmails: body.participant_emails,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    session: result.session,
    room_name: result.roomName,
  });
}
