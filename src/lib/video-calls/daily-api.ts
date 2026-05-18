import "server-only";

const DAILY_API_BASE = "https://api.daily.co/v1";

function getDailyApiKey(): string | null {
  return process.env.DAILY_API_KEY ?? null;
}

export function getDailyDomain(): string {
  return process.env.NEXT_PUBLIC_DAILY_DOMAIN ?? "sifsgold.daily.co";
}

export function isDailyConfigured(): boolean {
  return Boolean(getDailyApiKey() && getDailyDomain());
}

type DailyRoom = {
  id: string;
  name: string;
  url: string;
  config?: Record<string, unknown>;
};

async function dailyFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: string; status: number }> {
  const key = getDailyApiKey();
  if (!key) return { error: "Daily API not configured", status: 503 };

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
    const msg =
      (body as { error?: string; info?: string }).error ??
      (body as { info?: string }).info ??
      res.statusText;
    return { error: msg, status: res.status };
  }
  return { data: body as T, status: res.status };
}

export type CreateRoomOptions = {
  name: string;
  maxParticipants?: number;
  enableRecording?: boolean;
  exp?: number;
};

export async function createDailyRoom(options: CreateRoomOptions) {
  const domain = getDailyDomain();
  const properties: Record<string, unknown> = {
    max_participants: options.maxParticipants ?? 4,
    enable_chat: true,
    enable_screenshare: true,
    enable_knocking: true,
    exp: options.exp,
    enable_recording: options.enableRecording ? "cloud" : false,
    start_video_off: false,
    start_audio_off: false,
  };

  return dailyFetch<DailyRoom>("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name: options.name,
      privacy: "private",
      properties,
    }),
  });
}

export async function deleteDailyRoom(roomName: string) {
  return dailyFetch(`/rooms/${encodeURIComponent(roomName)}`, { method: "DELETE" });
}

export type MeetingTokenOptions = {
  roomName: string;
  userId: string;
  userName: string;
  isOwner?: boolean;
  enableRecording?: boolean;
  exp?: number;
};

export async function createMeetingToken(options: MeetingTokenOptions) {
  const exp = options.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 4;

  return dailyFetch<{ token: string }>("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: options.roomName,
        user_id: options.userId,
        user_name: options.userName,
        is_owner: options.isOwner ?? false,
        enable_recording: options.enableRecording ? "cloud" : false,
        exp,
      },
    }),
  });
}

export type DailyRecording = {
  id: string;
  room_name: string;
  status: string;
  max_participants?: number;
  duration?: number;
  download_link?: string;
};

export async function getRecording(recordingId: string) {
  return dailyFetch<DailyRecording>(`/recordings/${encodeURIComponent(recordingId)}`);
}

export async function listRoomRecordings(roomName: string) {
  return dailyFetch<{ data: DailyRecording[] }>(
    `/recordings?room_name=${encodeURIComponent(roomName)}`,
  );
}

export function roomNameFromUrl(roomUrl: string): string | null {
  try {
    const url = new URL(roomUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? null;
  } catch {
    return null;
  }
}
