import "server-only";

import {
  getBroadcasterToken,
  startLiveBroadcast,
} from "@/lib/streaming/daily-streaming";
import { createAdminClient } from "@/lib/supabase/admin";

export async function activateLiveStream(
  streamId: string,
  streamerId: string,
  streamerName: string,
) {
  const admin = createAdminClient();
  if (!admin) return { error: "Unavailable" as const };

  const { data: stream } = await admin
    .from("live_streams")
    .select("*")
    .eq("id", streamId)
    .maybeSingle();

  if (!stream || stream.streamer_id !== streamerId) {
    return { error: "Forbidden" as const };
  }

  const roomName = stream.daily_room_name as string | null;
  let hlsUrl = stream.hls_playback_url as string | null;
  let rtmpUrl = stream.rtmp_url as string | null;

  if (roomName) {
    const live = await startLiveBroadcast(roomName);
    if (live.hlsPlaybackUrl) hlsUrl = live.hlsPlaybackUrl;
    if (live.rtmpUrl) rtmpUrl = live.rtmpUrl;
  }

  const now = new Date().toISOString();
  await admin
    .from("live_streams")
    .update({
      status: "live",
      actual_start: stream.actual_start ?? now,
      hls_playback_url: hlsUrl,
      rtmp_url: rtmpUrl,
      broadcasting_url: hlsUrl ?? stream.broadcasting_url,
    })
    .eq("id", streamId);

  const tokenRes = roomName
    ? await getBroadcasterToken(roomName, streamerId, streamerName)
    : { data: undefined };

  return {
    status: "live" as const,
    hls_playback_url: hlsUrl,
    rtmp_url: rtmpUrl,
    broadcaster_token: tokenRes.data?.token ?? null,
  };
}
