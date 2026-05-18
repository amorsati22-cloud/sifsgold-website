import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { VaultProvider } from "@/components/vault/VaultProvider";
import { requireProDashboardUser } from "@/lib/dashboard";
import { VAULT_NAV } from "@/lib/vault/nav";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireProDashboardUser();

  return (
    <DashboardShell
      title="The Vault"
      description="Private, encrypted storage for licenses, formulas, contracts, and client records. PIN-protected — separate from your login password."
      nav={[...VAULT_NAV]}
    >
      <VaultProvider userId={user.id}>{children}</VaultProvider>
    </DashboardShell>
  );
}
