import "server-only";

import { randomUUID } from "crypto";
import {
  createDailyRoom,
  createMeetingToken,
  getDailyDomain,
  isDailyConfigured,
  roomNameFromUrl,
} from "@/lib/video-calls/daily-api";

const DAILY_API_BASE = "https://api.daily.co/v1";

function getDailyApiKey(): string | null {
  return process.env.DAILY_API_KEY ?? null;
}

async function dailyFetch<T>(path: string, init?: RequestInit) {
  const key = getDailyApiKey();
  if (!key) return { error: "Daily not configured", status: 503 as const };

  const res = await fetch(`${DAILY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      error:
        (body as { error?: string }).error ?? res.statusText,
      status: res.status,
    };
  }
  return { data: body as T, status: res.status };
}

export type LiveStreamRoom = {
  roomName: string;
  roomUrl: string;
  rtmpUrl: string | null;
  hlsPlaybackUrl: string | null;
};

/** Create a Daily room configured for live streaming (large audience via HLS). */
export async function createLiveStreamRoom(streamId: string): Promise<{
  room?: LiveStreamRoom;
  error?: string;
}> {
  const roomName = `live-${streamId.slice(0, 8)}-${randomUUID().slice(0, 6)}`;

  if (!isDailyConfigured()) {
    const domain = getDailyDomain();
    return {
      room: {
        roomName,
        roomUrl: `https://${domain}/${roomName}`,
        rtmpUrl: null,
        hlsPlaybackUrl: null,
      },
    };
  }

  const key = getDailyApiKey();
  const res = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: roomName,
      privacy: "public",
      properties: {
        max_participants: 2,
        enable_chat: false,
        enable_screenshare: true,
        enable_recording: "cloud",
        enable_live_streaming: true,
        start_video_off: false,
        start_audio_off: false,
        owner_only_broadcast: true,
      },
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (body as { error?: string }).error ?? "Failed to create room" };
  }

  const roomUrl = (body as { url: string }).url;
  return {
    room: {
      roomName: roomNameFromUrl(roomUrl) ?? roomName,
      roomUrl,
      rtmpUrl: null,
      hlsPlaybackUrl: null,
    },
  };
}

export async function startLiveBroadcast(roomName: string): Promise<{
  rtmpUrl?: string;
  hlsPlaybackUrl?: string;
  error?: string;
}> {
  const started = await dailyFetch<{
    rtmp_url?: string;
    hls_playback_url?: string;
    playback_url?: string;
  }>(`/rooms/${encodeURIComponent(roomName)}/live-streaming/start`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (started.error) {
    return { error: started.error };
  }

  return {
    rtmpUrl: started.data?.rtmp_url ?? null,
    hlsPlaybackUrl:
      started.data?.hls_playback_url ?? started.data?.playback_url ?? null,
  };
}

export async function stopLiveBroadcast(roomName: string) {
  return dailyFetch(`/rooms/${encodeURIComponent(roomName)}/live-streaming/stop`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function getBroadcasterToken(
  roomName: string,
  streamerId: string,
  streamerName: string,
) {
  return createMeetingToken({
    roomName,
    userId: streamerId,
    userName: streamerName,
    isOwner: true,
    enableRecording: true,
  });
}

export { createDailyRoom, createMeetingToken, isDailyConfigured };
