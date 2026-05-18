import { NextResponse } from "next/server";
import {
  getBroadcasterToken,
  startLiveBroadcast,
} from "@/lib/streaming/daily-streaming";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream } = await admin
    .from("live_streams")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!stream || stream.streamer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    .eq("id", id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const tokenRes = roomName
    ? await getBroadcasterToken(
        roomName,
        user.id,
        profile?.full_name ?? profile?.email ?? "Streamer",
      )
    : { data: undefined };

  return NextResponse.json({
    status: "live",
    hls_playback_url: hlsUrl,
    rtmp_url: rtmpUrl,
    room_url: stream.broadcasting_url,
    broadcaster_token: tokenRes.data?.token ?? null,
  });
}
