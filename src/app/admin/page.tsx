import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import { logAdminAudit } from "@/lib/admin/audit";
import { requireAdminPage } from "@/lib/admin/auth";
import { fetchAdminOverview } from "@/lib/admin/overview";

export default async function AdminOverviewPage() {
  const { admin, email } = await requireAdminPage();
  const data = await fetchAdminOverview(admin);

  await logAdminAudit({
    admin,
    adminEmail: email,
    action: "viewed_admin_overview",
  });

  return <AdminOverviewClient data={data} />;
}
