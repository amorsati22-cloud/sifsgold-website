import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireMessagingUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return { supabase, user };
}

export async function isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("blocked_users")
    .select("blocker_id")
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId)
    .maybeSingle();

  return Boolean(data);
}

export async function areUsersBlocked(a: string, b: string): Promise<boolean> {
  const [ab, ba] = await Promise.all([isBlocked(a, b), isBlocked(b, a)]);
  return ab || ba;
}

export async function getParticipantIds(threadId: string): Promise<string[]> {
  const admin = createAdminClient();
  const client = admin ?? (await createClient());
  if (!client) return [];

  const { data } = await client
    .from("thread_participants")
    .select("user_id")
    .eq("thread_id", threadId);

  return (data ?? []).map((r) => r.user_id as string);
}

export async function userInThread(threadId: string, userId: string): Promise<boolean> {
  const ids = await getParticipantIds(threadId);
  return ids.includes(userId);
}

export async function findExistingDmThread(userA: string, userB: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: aThreads } = await admin
    .from("thread_participants")
    .select("thread_id")
    .eq("user_id", userA);

  const threadIds = (aThreads ?? []).map((r) => r.thread_id as string);
  if (threadIds.length === 0) return null;

  for (const tid of threadIds) {
    const { data: thread } = await admin
      .from("threads")
      .select("id, thread_type")
      .eq("id", tid)
      .eq("thread_type", "dm")
      .maybeSingle();
    if (!thread) continue;

    const { data: b } = await admin
      .from("thread_participants")
      .select("user_id")
      .eq("thread_id", tid)
      .eq("user_id", userB)
      .maybeSingle();
    if (b) return tid;
  }

  return null;
}
