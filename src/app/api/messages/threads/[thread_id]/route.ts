import { NextResponse } from "next/server";
import {
  areUsersBlocked,
  getParticipantIds,
  requireMessagingUser,
  userInThread,
} from "@/lib/messaging/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteCtx = { params: { thread_id: string } };

export async function GET(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threadId = params.thread_id;
  if (!(await userInThread(threadId, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "30", 10));

  let query = session.supabase
    .from("messages")
    .select("*, message_reactions(message_id, user_id, emoji, created_at)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt("created_at", cursor);

  const { data: messages } = await query;

  const participantIds = await getParticipantIds(threadId);

  const { data: thread } = await session.supabase
    .from("threads")
    .select("*")
    .eq("id", threadId)
    .single();

  const { data: participants } = await session.supabase
    .from("thread_participants")
    .select("user_id, role, muted, last_read_at, bubble_style")
    .eq("thread_id", threadId);

  await session.supabase
    .from("thread_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("user_id", session.user.id);

  return NextResponse.json({
    thread,
    participant_ids: participantIds,
    participants,
    messages: (messages ?? []).reverse(),
    next_cursor: messages?.length === limit ? messages[messages.length - 1]?.created_at : null,
  });
}

export async function POST(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threadId = params.thread_id;
  if (!(await userInThread(threadId, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const participantIds = await getParticipantIds(threadId);

  for (const pid of participantIds) {
    if (pid === session.user.id) continue;
    if (await areUsersBlocked(session.user.id, pid)) {
      return NextResponse.json({ error: "Cannot message blocked user" }, { status: 403 });
    }
  }

  const deliveredTo = participantIds.filter((id) => id !== session.user.id);

  const { data: message, error } = await session.supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: session.user.id,
      encrypted_body: body.encrypted_body,
      iv: body.iv,
      encrypted_attachments: body.encrypted_attachments ?? null,
      attachments_iv: body.attachments_iv ?? null,
      reply_to_message_id: body.reply_to_message_id ?? null,
      delivered_to: deliveredTo,
      read_by: [session.user.id],
    })
    .select("*")
    .single();

  if (error || !message) {
    return NextResponse.json({ error: error?.message ?? "Send failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const db = admin ?? session.supabase;

  await db
    .from("threads")
    .update({
      last_message_at: message.created_at,
      encrypted_last_preview: body.encrypted_preview ?? body.encrypted_body,
      preview_iv: body.preview_iv ?? body.iv,
    })
    .eq("id", threadId);

  return NextResponse.json({ message, participant_ids: participantIds });
}
