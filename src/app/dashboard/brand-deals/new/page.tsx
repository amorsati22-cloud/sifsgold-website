import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CampaignWizard } from "@/components/brand-deals/CampaignWizard";
import { BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";

export default function NewBrandCampaignPage() {
  return (
    <DashboardShell
      title="New campaign"
      description="Build a campaign, fund escrow, and publish to Sif's Advocates. Seventy percent to creators on approved deliverables."
      nav={BRAND_DEALS_NAV}
    >
      <CampaignWizard />
    </DashboardShell>
  );
}
