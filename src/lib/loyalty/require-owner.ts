import "server-only";

import { redirect } from "next/navigation";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { isSalonUserType } from "@/lib/auth-salon";
import { createClient } from "@/lib/supabase/server";
import type { LoyaltyOwnerType } from "@/lib/loyalty/types";

export async function requireLoyaltyOwner() {
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  const userType = profile?.user_type as string | undefined;
  let ownerType: LoyaltyOwnerType | null = null;

  if (userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number])) {
    ownerType = "pro";
  } else if (userType && isSalonUserType(userType)) {
    ownerType = "salon";
  } else if (userType && BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number])) {
    ownerType = "brand";
  }

  if (!ownerType) redirect("/dashboard");

  return { supabase, user, ownerType };
}
