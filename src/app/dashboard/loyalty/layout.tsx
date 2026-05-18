import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LOYALTY_OWNER_NAV } from "@/lib/loyalty/nav";
import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";

export default async function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  await requireLoyaltyOwner();
  return (
    <DashboardShell title="Loyalty" description="Points, tiers, rewards, and referrals for your clients." nav={[...LOYALTY_OWNER_NAV]}>
      {children}
    </DashboardShell>
  );
}
