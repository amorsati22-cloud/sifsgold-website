import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SALON_DASHBOARD_NAV } from "@/lib/salons/nav";
import { ensureOwnerStaffRow } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export default async function SalonDashboardLayout({ children }: { children: React.ReactNode }) {
  const { salon, user } = await requireSalonDashboardUser();
  await ensureOwnerStaffRow(salon, user.id);

  return (
    <DashboardShell
      title="Salon dashboard"
      description="Manage your team, schedule, inventory, and payouts in one place."
      nav={[...SALON_DASHBOARD_NAV]}
    >
      {children}
    </DashboardShell>
  );
}
