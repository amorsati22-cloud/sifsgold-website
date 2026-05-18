import "server-only";

import { randomUUID } from "crypto";
import {
  createDailyRoom,
  getDailyDomain,
  isDailyConfigured,
  roomNameFromUrl,
} from "@/lib/video-calls/daily-api";
import { isVideoCallsUnlocked } from "@/lib/video-calls/milestone";
import type { VideoCallSessionType } from "@/lib/video-calls/types";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateSessionInput = {
  hostId: string;
  title: string;
  description?: string;
  sessionType: VideoCallSessionType;
  scheduledStart: string;
  scheduledEnd: string;
  timezone: string;
  maxParticipants?: number;
  recordingEnabled?: boolean;
  linkedAppointmentId?: string;
  linkedBrandDealId?: string;
  linkedClassId?: string;
  participantUserIds?: string[];
  participantEmails?: string[];
};

export async function createVideoCallSession(input: CreateSessionInput) {
  const admin = createAdminClient();
  if (!admin) return { error: "Database unavailable" as const };

  const milestone = await isVideoCallsUnlocked();
  if (!milestone.unlocked) {
    return {
      error: `Video calls unlock at ${milestone.required} paid subscribers (${milestone.count}/${milestone.required})`,
    } as const;
  }

  const roomName = `sg-${input.hostId.slice(0, 8)}-${randomUUID().slice(0, 8)}`;
  let roomUrl: string | null = null;
  let dailyRoomId: string | null = null;

  if (isDailyConfigured()) {
    const exp = Math.floor(new Date(input.scheduledEnd).getTime() / 1000) + 3600;
    const room = await createDailyRoom({
      name: roomName,
      maxParticipants: input.maxParticipants ?? 4,
      enableRecording: input.recordingEnabled ?? false,
      exp,
    });
    if (room.error) return { error: room.error } as const;
    roomUrl = room.data?.url ?? `https://${getDailyDomain()}/${roomName}`;
    dailyRoomId = room.data?.id ?? roomName;
  } else {
    roomUrl = `https://${getDailyDomain()}/${roomName}`;
    dailyRoomId = roomName;
  }

  const { data: session, error } = await admin
    .from("video_call_sessions")
    .insert({
      title: input.title,
      description: input.description ?? null,
      room_url: roomUrl,
      daily_room_id: dailyRoomId,
      session_type: input.sessionType,
      host_id: input.hostId,
      linked_appointment_id: input.linkedAppointmentId ?? null,
      linked_brand_deal_id: input.linkedBrandDealId ?? null,
      linked_class_id: input.linkedClassId ?? null,
      max_participants: input.maxParticipants ?? 4,
      scheduled_start: input.scheduledStart,
      scheduled_end: input.scheduledEnd,
      timezone: input.timezone,
      recording_enabled: input.recordingEnabled ?? false,
      status: "scheduled",
    })
    .select()
    .single();

  if (error || !session) return { error: error?.message ?? "Failed to create session" } as const;

  const participantRows = [
    {
      session_id: session.id,
      user_id: input.hostId,
      role: "host",
      recording_consent: false,
    },
    ...(input.participantUserIds ?? [])
      .filter((id) => id !== input.hostId)
      .map((userId) => ({
        session_id: session.id,
        user_id: userId,
        role: "participant" as const,
        recording_consent: false,
      })),
    ...(input.participantEmails ?? []).map((email) => ({
      session_id: session.id,
      invite_email: email.toLowerCase(),
      role: "participant" as const,
      recording_consent: false,
    })),
  ];

  await admin.from("video_call_participants").insert(participantRows);

  if (input.linkedAppointmentId) {
    await admin
      .from("appointments")
      .update({ video_call_session_id: session.id })
      .eq("id", input.linkedAppointmentId);
  }

  return { session, roomName: roomNameFromUrl(roomUrl) ?? roomName };
}

export async function logParticipantCost(
  sessionId: string,
  participantId: string,
  durationSeconds: number,
) {
  const admin = createAdminClient();
  if (!admin) return;

  const minutes = durationSeconds / 60;
  const cost = minutes * 0.004;

  await admin.from("video_call_cost_log").insert({
    session_id: sessionId,
    participant_id: participantId,
    participant_minutes: minutes,
    cost_usd: cost,
  });
}
