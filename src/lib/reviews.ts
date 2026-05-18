import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function canUserReviewPro(userId: string | null, proId: string): Promise<boolean> {
  if (!userId || !isSupabaseConfigured()) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("appointments")
    .select("id")
    .eq("client_id", userId)
    .eq("pro_id", proId)
    .eq("status", "completed")
    .limit(1);

  if (error) {
    return false;
  }

  return (data?.length ?? 0) > 0;
}
