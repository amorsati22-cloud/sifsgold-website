import "server-only";

import { MILESTONE_PAID_SUBSCRIBERS } from "@/lib/video-calls/types";
import { createAdminClient } from "@/lib/supabase/admin";

const FREE_TIERS = new Set(["student-free", "client-free", "school-free"]);

/** Platform-wide count of active paid Sif's Gold subscribers. */
export async function getPaidSubscriberCount(): Promise<number> {
  const admin = createAdminClient();
  if (!admin) return 0;

  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("subscription_status", "active")
    .not("subscription_tier", "is", null);

  if (error || count == null) return 0;

  const { data: rows } = await admin
    .from("profiles")
    .select("subscription_tier")
    .eq("subscription_status", "active")
    .not("subscription_tier", "is", null);

  return (rows ?? []).filter((r) => {
    const tier = r.subscription_tier as string | null;
    return tier && !FREE_TIERS.has(tier);
  }).length;
}

export async function isVideoCallsUnlocked(): Promise<{
  unlocked: boolean;
  count: number;
  required: number;
}> {
  const count = await getPaidSubscriberCount();
  return {
    unlocked: count >= MILESTONE_PAID_SUBSCRIBERS,
    count,
    required: MILESTONE_PAID_SUBSCRIBERS,
  };
}
