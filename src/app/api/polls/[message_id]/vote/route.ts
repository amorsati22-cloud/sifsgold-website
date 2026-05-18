import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMessagingUser } from "@/lib/messaging/server";

export const runtime = "nodejs";

type RouteCtx = { params: { message_id: string } };

export async function POST(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { selected_options: string[] };

  const { data: message } = await session.supabase
    .from("messages")
    .select("id, thread_id, message_type, poll_data")
    .eq("id", params.message_id)
    .single();

  if (!message || message.message_type !== "poll") {
    return NextResponse.json({ error: "Not a poll" }, { status: 400 });
  }

  const { data: participant } = await session.supabase
    .from("thread_participants")
    .select("user_id")
    .eq("thread_id", message.thread_id)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!participant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const poll = message.poll_data as { expires_at?: string | null; allow_edit_vote?: boolean } | null;
  if (poll?.expires_at && new Date(poll.expires_at) < new Date()) {
    return NextResponse.json({ error: "Poll expired" }, { status: 400 });
  }

  const admin = createAdminClient();
  const db = admin ?? session.supabase;

  await db.from("poll_responses").upsert({
    message_id: params.message_id,
    user_id: session.user.id,
    selected_options: body.selected_options,
    voted_at: new Date().toISOString(),
  });

  const { data: votes } = await db
    .from("poll_responses")
    .select("selected_options")
    .eq("message_id", params.message_id);

  const tally: Record<string, number> = {};
  for (const v of votes ?? []) {
    for (const opt of v.selected_options as string[]) {
      tally[opt] = (tally[opt] ?? 0) + 1;
    }
  }

  return NextResponse.json({ tally, total_votes: votes?.length ?? 0 });
}
