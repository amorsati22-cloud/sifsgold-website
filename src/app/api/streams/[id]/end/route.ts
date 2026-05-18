import { NextResponse } from "next/server";
import { stopLiveBroadcast } from "@/lib/streaming/daily-streaming";
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
  if (roomName) await stopLiveBroadcast(roomName);

  const now = new Date().toISOString();
  const start = stream.actual_start ? new Date(stream.actual_start as string) : new Date();
  const durationMinutes = Math.max(1, Math.round((Date.now() - start.getTime()) / 60000));

  const { data: tips } = await admin
    .from("stream_tips")
    .select("amount")
    .eq("stream_id", id)
    .eq("payout_status", "completed");

  const totalTips = (tips ?? []).reduce((s, t) => s + Number(t.amount), 0);

  await admin
    .from("live_streams")
    .update({
      status: "ended",
      actual_end: now,
      duration_minutes: durationMinutes,
      total_tips_received: totalTips,
    })
    .eq("id", id);

  return NextResponse.json({
    ok: true,
    duration_minutes: durationMinutes,
    total_tips_received: totalTips,
  });
}
