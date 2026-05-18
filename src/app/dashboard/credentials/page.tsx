import type { Metadata } from "next";
import { CredentialsManager } from "@/components/dashboard/CredentialsManager";
import { getDashboardCredentials, requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Credentials",
  robots: { index: false, follow: false },
};

export default async function DashboardCredentialsPage() {
  const { user } = await requireProDashboardUser();
  const credentials = await getDashboardCredentials(user.id);
  return <CredentialsManager proId={user.id} initial={credentials} />;
}
