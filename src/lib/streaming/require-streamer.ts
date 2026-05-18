import "server-only";

import { redirect } from "next/navigation";
import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const STREAMER_USER_TYPES = new Set([
  ...PRO_USER_TYPES,
  ...ADVOCATE_USER_TYPES,
  ...BRAND_USER_TYPES,
  "school",
  "salon",
  "fashion_pro",
]);

export async function requireStreamerDashboardUser() {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.user_type || !STREAMER_USER_TYPES.has(profile.user_type)) {
    redirect("/for-pros");
  }

  return { supabase, user, profile };
}
