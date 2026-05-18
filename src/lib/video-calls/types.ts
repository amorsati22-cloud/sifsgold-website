export type VideoCallSessionType = "consultation" | "class" | "brand_meeting" | "support";

export type VideoCallSessionStatus =
  | "scheduled"
  | "in_progress"
  | "ended"
  | "cancelled"
  | "no_show";

export type ParticipantRole = "host" | "co_host" | "participant" | "observer";

export type VideoCallSession = {
  id: string;
  title: string | null;
  description: string | null;
  room_url: string | null;
  daily_room_id: string | null;
  session_type: VideoCallSessionType;
  host_id: string;
  linked_appointment_id: string | null;
  linked_brand_deal_id: string | null;
  linked_class_id: string | null;
  max_participants: number;
  scheduled_start: string;
  scheduled_end: string;
  actual_start: string | null;
  actual_end: string | null;
  status: VideoCallSessionStatus;
  recording_enabled: boolean;
  recording_url: string | null;
  recording_consent_required: boolean;
  total_participants: number;
  timezone: string;
  created_at: string;
};

export type VideoCallParticipant = {
  id: string;
  session_id: string;
  user_id: string | null;
  invite_email: string | null;
  joined_at: string | null;
  left_at: string | null;
  duration_seconds: number | null;
  role: ParticipantRole;
  recording_consent: boolean;
  recording_consent_at: string | null;
};

export type VideoCallSettings = {
  id: string;
  video_calls_enabled: boolean;
  requires_500_paid_subscribers_check: boolean;
  consultation_rate_per_minute: number | null;
  recording_allowed: boolean;
  recording_default_consent: string;
  default_call_duration_minutes: number;
};

export const PARTICIPANT_COST_PER_MINUTE_USD = 0.004;
export const MILESTONE_PAID_SUBSCRIBERS = 500;
export const RECORDING_RETENTION_DAYS = 90;
