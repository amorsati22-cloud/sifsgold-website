import { notFound, redirect } from "next/navigation";
import { ThreadView } from "@/components/messaging/ThreadView";
import { getParticipantIds, requireMessagingUser, userInThread } from "@/lib/messaging/server";

export const metadata = {
  title: "Conversation",
  robots: { index: false, follow: false },
};

type Props = { params: { thread_id: string } };

export default async function ThreadPage({ params }: Props) {
  const session = await requireMessagingUser();
  if (!session) redirect("/sign-in?next=/dashboard/messages");

  const threadId = params.thread_id;
  if (!(await userInThread(threadId, session.user.id))) notFound();

  const { supabase, user } = session;
  const { data: thread } = await supabase.from("threads").select("*").eq("id", threadId).single();

  let query = supabase
    .from("messages")
    .select("*, message_reactions(message_id, user_id, emoji, created_at)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: rawMessages } = await query;
  const messages = (rawMessages ?? []).map((row) => {
    const { message_reactions, ...rest } = row as typeof row & {
      message_reactions?: { message_id: string; user_id: string; emoji: string; created_at: string }[];
    };
    return { ...rest, reactions: message_reactions ?? [] };
  });
  const participantIds = await getParticipantIds(threadId);

  await supabase
    .from("thread_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("user_id", user.id);

  if (!thread) notFound();

  return (
    <ThreadView
      threadId={threadId}
      userId={user.id}
      initialThread={thread}
      initialParticipantIds={participantIds}
      initialMessages={messages}
    />
  );
}
