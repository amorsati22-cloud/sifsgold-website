import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PRO_OPS_NAV } from "@/lib/pro-ops/nav";
import { requireProOpsUser } from "@/lib/dashboard/require-pro-ops";

export default async function ProOpsLayout({ children }: { children: React.ReactNode }) {
  await requireProOpsUser();

  return (
    <DashboardShell
      title="Pro dashboard"
      description="Run your business — bookings, clients, earnings, and schedule."
      nav={[...PRO_OPS_NAV]}
    >
      {children}
    </DashboardShell>
  );
}
