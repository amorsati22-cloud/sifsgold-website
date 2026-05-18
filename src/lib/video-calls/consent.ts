import "server-only";

import type { VideoCallParticipant } from "@/lib/video-calls/types";
import { createAdminClient } from "@/lib/supabase/admin";

export type ConsentStatus = {
  allConsented: boolean;
  required: boolean;
  participants: Array<{
    id: string;
    user_id: string | null;
    recording_consent: boolean;
    recording_consent_at: string | null;
  }>;
  missingCount: number;
};

/** All joined participants with user_id must consent before recording starts. */
export async function getRecordingConsentStatus(
  sessionId: string,
): Promise<ConsentStatus> {
  const admin = createAdminClient();
  if (!admin) {
    return { allConsented: false, required: true, participants: [], missingCount: 0 };
  }

  const { data: session } = await admin
    .from("video_call_sessions")
    .select("recording_enabled, recording_consent_required")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session?.recording_enabled) {
    return { allConsented: true, required: false, participants: [], missingCount: 0 };
  }

  const { data: participants } = await admin
    .from("video_call_participants")
    .select("id, user_id, recording_consent, recording_consent_at, joined_at")
    .eq("session_id", sessionId);

  const active = (participants ?? []).filter(
    (p) => p.user_id && p.joined_at,
  ) as VideoCallParticipant[];

  const missing = active.filter((p) => !p.recording_consent);

  return {
    allConsented: missing.length === 0 && active.length > 0,
    required: Boolean(session.recording_consent_required),
    participants: active.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      recording_consent: p.recording_consent,
      recording_consent_at: p.recording_consent_at,
    })),
    missingCount: missing.length,
  };
}

export async function recordParticipantConsent(
  sessionId: string,
  userId: string,
  consented: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Unavailable" };

  const { error } = await admin
    .from("video_call_participants")
    .update({
      recording_consent: consented,
      recording_consent_at: consented ? new Date().toISOString() : null,
    })
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
