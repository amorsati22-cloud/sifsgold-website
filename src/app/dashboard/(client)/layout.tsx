import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CLIENT_DASHBOARD_NAV } from "@/lib/client-dashboard/nav";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export default async function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireClientDashboardUser();

  return (
    <DashboardShell
      title="Your account"
      description="Appointments, favorites, Client Vision, and payments — mirrored from the mobile app home."
      nav={[...CLIENT_DASHBOARD_NAV]}
    >
      {children}
    </DashboardShell>
  );
}
