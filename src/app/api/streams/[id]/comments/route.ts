import { NextResponse } from "next/server";
import { filterComment } from "@/lib/streaming/banned-words";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ comments: [] });

  let query = admin
    .from("stream_comments")
    .select("*, profiles:author_id(full_name, avatar_url)")
    .eq("stream_id", id)
    .eq("moderated", false)
    .order("posted_at", { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt("posted_at", cursor);

  const { data } = await query;
  return NextResponse.json({ comments: (data ?? []).reverse() });
}

type PostBody = {
  content: string;
  reaction?: string;
};

export async function POST(request: Request, { params }: Params) {
  const { id: streamId } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });

  const body = (await request.json()) as PostBody;
  const filtered = filterComment(body.content ?? "");
  if (!filtered.allowed) {
    return NextResponse.json({ error: filtered.reason }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream } = await admin
    .from("live_streams")
    .select("status")
    .eq("id", streamId)
    .maybeSingle();

  if (stream?.status !== "live") {
    return NextResponse.json({ error: "Stream not live" }, { status: 400 });
  }

  const { data: comment, error } = await admin
    .from("stream_comments")
    .insert({
      stream_id: streamId,
      author_id: user.id,
      content: body.content.trim(),
      reactions: body.reaction ? { [body.reaction]: 1 } : {},
    })
    .select("*, profiles:author_id(full_name, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comment });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id: streamId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    comment_id: string;
    moderated?: boolean;
    pinned?: boolean;
    highlighted?: boolean;
  };

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream } = await admin
    .from("live_streams")
    .select("streamer_id")
    .eq("id", streamId)
    .maybeSingle();

  if (stream?.streamer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await admin
    .from("stream_comments")
    .update({
      moderated: body.moderated,
      pinned: body.pinned,
      highlighted: body.highlighted,
    })
    .eq("id", body.comment_id)
    .eq("stream_id", streamId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
