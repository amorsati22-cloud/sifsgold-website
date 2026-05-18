import type { Metadata } from "next";
import { subDays } from "date-fns";
import { SalonPayoutPanel } from "@/components/salon/SalonPayoutPanel";
import { calculateStaffPayouts, getSalonPayoutHistory } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Payouts",
  robots: { index: false, follow: false },
};

export default async function SalonPayoutsPage() {
  const { salon } = await requireSalonDashboardUser();
  const periodEnd = new Date();
  const periodStart = subDays(periodEnd, 7);

  const [lines, history] = await Promise.all([
    calculateStaffPayouts(salon.id, periodStart, periodEnd),
    getSalonPayoutHistory(salon.id),
  ]);

  return (
    <SalonPayoutPanel
      salonId={salon.id}
      initialLines={lines}
      initialHistory={history}
      periodStart={periodStart.toISOString().slice(0, 10)}
      periodEnd={periodEnd.toISOString().slice(0, 10)}
    />
  );
}
