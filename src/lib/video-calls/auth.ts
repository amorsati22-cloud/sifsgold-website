import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function assertSessionAccess(sessionId: string, userId: string) {
  const admin = createAdminClient();
  if (!admin) return { allowed: false as const, reason: "unavailable" };

  const { data: session } = await admin
    .from("video_call_sessions")
    .select("host_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) return { allowed: false as const, reason: "not_found" };
  if (session.host_id === userId) return { allowed: true as const, isHost: true };

  const { data: participant } = await admin
    .from("video_call_participants")
    .select("id, role")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (participant) return { allowed: true as const, isHost: false, participant };
  return { allowed: false as const, reason: "forbidden" };
}
