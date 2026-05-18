export type StreamCategory = "tutorial" | "product_launch" | "q_and_a" | "class" | "event";

export type StreamStatus = "scheduled" | "live" | "ended" | "cancelled";

export type StreamVisibility = "public" | "followers_only" | "paid_subscribers" | "private";

export type LiveStream = {
  id: string;
  streamer_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: StreamCategory;
  tags: string[];
  scheduled_start: string;
  actual_start: string | null;
  actual_end: string | null;
  status: StreamStatus;
  duration_minutes: number | null;
  max_viewers_concurrent: number;
  total_unique_viewers: number;
  total_tips_received: number;
  recording_url: string | null;
  recording_available: boolean;
  accepts_tips: boolean;
  minimum_tip: number;
  visibility: StreamVisibility;
  broadcasting_url: string | null;
  hls_playback_url: string | null;
  rtmp_url: string | null;
  daily_room_name: string | null;
  created_at: string;
};

export const STREAM_TIP_PLATFORM_FEE_RATE = 0.05;
