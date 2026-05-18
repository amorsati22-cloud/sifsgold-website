import type { Metadata } from "next";
import Link from "next/link";
import { AvailabilityEditor } from "@/components/booking/AvailabilityEditor";
import { requireProDashboardUser, getDashboardProProfile } from "@/lib/dashboard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AvailabilityOverride, AvailabilityRule } from "@/types/booking";

export const metadata: Metadata = {
  title: "Availability",
  robots: { index: false, follow: false },
};

export default async function DashboardAvailabilityPage() {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);
  const admin = createAdminClient();

  let rules: AvailabilityRule[] = [];
  let overrides: AvailabilityOverride[] = [];

  if (admin) {
    const [rulesRes, overridesRes] = await Promise.all([
      admin.from("availability_rules").select("*").eq("pro_id", user.id),
      admin.from("availability_overrides").select("*").eq("pro_id", user.id).order("override_date"),
    ]);
    rules = (rulesRes.data ?? []) as AvailabilityRule[];
    overrides = (overridesRes.data ?? []) as AvailabilityOverride[];
  }

  const timezone = (profile as { timezone?: string } | null)?.timezone ?? "America/Chicago";

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/dashboard/profile" className="hover:text-gold">
          Pro dashboard
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">Availability</span>
      </nav>
      <h1 className="mb-2 font-heading text-3xl text-gold">Availability</h1>
      <p className="mb-8 font-body text-sm text-gold-body">
        Set your weekly hours and time off. Open booking slots update automatically.
      </p>
      <AvailabilityEditor
        proId={user.id}
        timezone={timezone}
        initialRules={rules}
        initialOverrides={overrides}
      />
    </div>
  );
}
