import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdvocateOnboardingWizard } from "@/components/advocates/AdvocateOnboardingWizard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  isAdvocateOnboardingComplete,
  type AdvocateProfileRow,
} from "@/lib/advocates/profile";
import { refreshConnectOnboardedStatus } from "@/lib/advocates/stripe-connect";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function resolveInitialStep(profile: AdvocateProfileRow | null): number {
  if (!profile?.agreement_signed_at) return 1;
  if (!profile.stripe_connect_onboarded) return 2;
  if (!profile.ftc_training_acknowledged_at) return 3;
  return 4;
}

export default async function AdvocateOnboardingPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const admin = createAdminClient();
  if (admin) {
    await refreshConnectOnboardedStatus(admin, user.id);
  }

  const { data: advocate } = await supabase.from("advocate_profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = (advocate as AdvocateProfileRow | null) ?? null;

  if (isAdvocateOnboardingComplete(profile)) {
    redirect("/dashboard/advocate");
  }

  const initialStep = resolveInitialStep(profile);

  return (
    <DashboardShell
      title="Advocate onboarding"
      description="Complete these steps to unlock your dashboard, brand deals, and payouts."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <Suspense fallback={<p className="font-body text-gold-body">Loading…</p>}>
        <AdvocateOnboardingWizard
          initialStep={initialStep}
          agreementSigned={Boolean(profile?.agreement_signed_at)}
          connectOnboarded={Boolean(profile?.stripe_connect_onboarded)}
          ftcAcknowledged={Boolean(profile?.ftc_training_acknowledged_at)}
          displayName={profile?.display_name ?? ""}
          bio={profile?.bio ?? ""}
          specialtyTags={profile?.specialty_tags ?? profile?.specialties ?? []}
          sampleUrls={profile?.sample_content_urls ?? []}
        />
      </Suspense>
    </DashboardShell>
  );
}
