import "server-only";

import { redirect } from "next/navigation";
import { isAdvocateUserType } from "@/lib/auth-advocate";
import {
  advocateFtcStatus,
  isAdvocateOnboardingComplete,
  type AdvocateProfileRow,
} from "@/lib/advocates/profile";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function requireAdvocateDashboard(options?: { skipOnboardingCheck?: boolean }) {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, email, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !isAdvocateUserType(profile.user_type)) {
    redirect("/advocates");
  }

  const { data: advocate } = await supabase
    .from("advocate_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const advocateRow = (advocate as AdvocateProfileRow | null) ?? null;
  const onboardingComplete = isAdvocateOnboardingComplete(advocateRow);
  const ftc = advocateFtcStatus(advocateRow);

  if (!options?.skipOnboardingCheck && !onboardingComplete) {
    redirect("/dashboard/advocate/onboarding");
  }

  if (ftc.suspended) {
    redirect("/dashboard/advocate?error=suspended");
  }

  return {
    supabase,
    user,
    profile,
    advocate: advocateRow,
    onboardingComplete,
    ftc,
  };
}
