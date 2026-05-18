import { NextResponse } from "next/server";
import { assertSessionAccess, getSessionUser } from "@/lib/video-calls/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: messages } = await admin
    .from("video_call_chat_messages")
    .select("*, profiles(full_name, avatar_url)")
    .eq("session_id", sessionId)
    .order("sent_at", { ascending: true })
    .limit(200);

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { message: string; to_recipient_id?: string };
  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data, error } = await admin
    .from("video_call_chat_messages")
    .insert({
      session_id: sessionId,
      sender_id: user.id,
      message: body.message.trim(),
      to_recipient_id: body.to_recipient_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
