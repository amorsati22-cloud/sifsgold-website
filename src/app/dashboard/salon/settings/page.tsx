import type { Metadata } from "next";
import { SalonSettingsForm } from "@/components/salon/SalonSettingsForm";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Salon settings",
  robots: { index: false, follow: false },
};

export default async function SalonSettingsPage() {
  const { salon } = await requireSalonDashboardUser();

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-gold-body">
        Business info is encrypted where required. Public profile fields appear on your salon page.
      </p>
      <SalonSettingsForm salon={salon} />
    </div>
  );
}
