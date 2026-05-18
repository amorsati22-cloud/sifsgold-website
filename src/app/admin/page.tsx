import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import { requireAdminPage } from "@/lib/admin/auth";
import { fetchAdminOverview } from "@/lib/admin/overview";

export default async function AdminOverviewPage() {
  const { admin } = await requireAdminPage();
  const data = await fetchAdminOverview(admin);

  return <AdminOverviewClient data={data} />;
}
