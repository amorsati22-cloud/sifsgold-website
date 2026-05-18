import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { FTC_MAX_STRIKES } from "@/lib/brand-deals/constants";

export type AdvocateProfileRow = {
  id: string;
  display_name: string;
  bio: string | null;
  specialties: string[] | null;
  specialty_tags: string[] | null;
  stripe_connect_account_id: string | null;
  stripe_connect_onboarded: boolean | null;
  agreement_signed_at: string | null;
  agreement_version: string | null;
  ftc_training_acknowledged_at: string | null;
  ftc_strike_count: number | null;
  marketplace_suspended: boolean | null;
  status: string | null;
  tier: string | null;
  featured: boolean | null;
  sample_content_urls: string[] | null;
  application_id: string | null;
  accepted_at: string | null;
};

export function isAdvocateOnboardingComplete(profile: AdvocateProfileRow | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.agreement_signed_at &&
      profile.stripe_connect_onboarded &&
      profile.ftc_training_acknowledged_at &&
      profile.display_name,
  );
}

export function advocateFtcStatus(profile: AdvocateProfileRow | null): {
  strikes: number;
  maxStrikes: number;
  suspended: boolean;
  label: string;
} {
  const strikes = profile?.ftc_strike_count ?? 0;
  const suspended = Boolean(profile?.marketplace_suspended || profile?.status === "suspended");
  return {
    strikes,
    maxStrikes: FTC_MAX_STRIKES,
    suspended,
    label: suspended
      ? "Suspended — contact support"
      : strikes === 0
        ? "Compliant"
        : `${strikes} of ${FTC_MAX_STRIKES} strikes`,
  };
}

export async function createAdvocateProfileFromApplication(
  admin: SupabaseClient,
  params: {
    userId: string;
    applicationId: string;
    email: string;
    fullName: string;
    specialty?: string | null;
    socialHandles?: string | null;
    sampleUrls?: string[] | null;
  },
) {
  const specialties = params.specialty
    ? params.specialty.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const { data, error } = await admin
    .from("advocate_profiles")
    .upsert(
      {
        id: params.userId,
        display_name: params.fullName,
        bio: null,
        specialties,
        specialty_tags: specialties,
        application_id: params.applicationId,
        accepted_at: new Date().toISOString(),
        tier: "gold",
        status: "active",
        instagram_handle: params.socialHandles,
        sample_content_urls: params.sampleUrls ?? [],
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as AdvocateProfileRow;
}

export async function findProfileIdByEmail(admin: SupabaseClient, email: string) {
  const { data } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  return data?.id as string | undefined;
}
