import { NextResponse } from "next/server";
import { createLiveStreamRoom } from "@/lib/streaming/daily-streaming";
import type { StreamCategory, StreamVisibility } from "@/lib/streaming/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = Math.min(Number(searchParams.get("limit") ?? 24), 50);

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ streams: [] });

  let query = admin
    .from("live_streams")
    .select("*, profiles:streamer_id(full_name, avatar_url, user_type)")
    .eq("visibility", "public")
    .order("scheduled_start", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);

  const { data } = await query;
  return NextResponse.json({ streams: data ?? [] });
}

type CreateBody = {
  title: string;
  description?: string;
  thumbnail_url?: string;
  category?: StreamCategory;
  tags?: string[];
  scheduled_start: string;
  go_live_now?: boolean;
  accepts_tips?: boolean;
  minimum_tip?: number;
  visibility?: StreamVisibility;
  access_code?: string;
  recording_available?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as CreateBody;
  if (!body.title?.trim() || !body.scheduled_start) {
    return NextResponse.json({ error: "Title and schedule required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream, error } = await admin
    .from("live_streams")
    .insert({
      streamer_id: user.id,
      title: body.title.trim(),
      description: body.description ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      category: body.category ?? "tutorial",
      tags: body.tags ?? [],
      scheduled_start: body.scheduled_start,
      accepts_tips: body.accepts_tips ?? true,
      minimum_tip: body.minimum_tip ?? 1,
      visibility: body.visibility ?? "public",
      access_code: body.access_code ?? null,
      recording_available: body.recording_available ?? true,
      status: "scheduled",
    })
    .select()
    .single();

  if (error || !stream) {
    return NextResponse.json({ error: error?.message ?? "Failed" }, { status: 500 });
  }

  const room = await createLiveStreamRoom(stream.id as string);
  if (room.room) {
    await admin
      .from("live_streams")
      .update({
        daily_room_name: room.room.roomName,
        broadcasting_url: room.room.roomUrl,
      })
      .eq("id", stream.id);
  }

  if (body.go_live_now) {
    const startRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/streams/${stream.id}/start`,
      {
        method: "POST",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    );
    if (!startRes.ok) {
      return NextResponse.json({ stream, warning: "Created but go-live failed" });
    }
  }

  return NextResponse.json({ stream });
}
