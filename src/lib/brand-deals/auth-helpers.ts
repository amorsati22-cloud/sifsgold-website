import "server-only";

import { isAdvocateUserType } from "@/lib/auth-advocate";
import { isBrandUserType } from "@/lib/auth-brand";
import { createClient } from "@/lib/supabase/server";

export async function getSessionProfile() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, profile: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase.from("profiles").select("id, user_type").eq("id", user.id).single();
  return { supabase, user, profile };
}

export function isAdminUser(userId: string): boolean {
  const admins = (process.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return admins.includes(userId);
}

export async function requireBrandPartner() {
  const ctx = await getSessionProfile();
  if (!ctx.user || !ctx.profile || !isBrandUserType(ctx.profile.user_type)) {
    return { ...ctx, authorized: false as const };
  }
  return { ...ctx, authorized: true as const };
}

export async function requireAdvocate() {
  const ctx = await getSessionProfile();
  if (!ctx.user || !ctx.profile || !isAdvocateUserType(ctx.profile.user_type)) {
    return { ...ctx, authorized: false as const };
  }
  const { data: advocate } = await ctx.supabase!
    .from("advocate_profiles")
    .select("*")
    .eq("id", ctx.user.id)
    .maybeSingle();

  if (advocate?.marketplace_suspended) {
    return { ...ctx, authorized: false as const, suspended: true as const };
  }
  return { ...ctx, authorized: true as const, advocate };
}
