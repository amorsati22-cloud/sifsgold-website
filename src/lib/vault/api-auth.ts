import "server-only";

import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function getVaultApiUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !PRO_USER_TYPES.includes(profile.user_type as (typeof PRO_USER_TYPES)[number])) {
    return null;
  }

  return { supabase, user };
}
