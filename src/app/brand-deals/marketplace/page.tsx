import { MarketplaceCampaignList } from "@/components/brand-deals/MarketplaceCampaignList";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ADVOCATE_BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { createClient } from "@/lib/supabase/server";

export default async function BrandDealsMarketplacePage() {
  const supabase = await createClient();

  const { data: campaigns } = supabase
    ? await supabase
        .from("brand_campaigns")
        .select(
          "id, title, description, per_advocate_compensation, application_deadline, campaign_type, objective, published_at",
        )
        .eq("status", "published")
        .eq("escrow_funded", true)
        .order("published_at", { ascending: false })
    : { data: [] };

  return (
    <DashboardShell
      title="Campaign marketplace"
      description="Gold Partner campaigns for Sif's Advocates. Apply with your pitch — paid on deliverable approval (70% to you)."
      nav={ADVOCATE_BRAND_DEALS_NAV}
    >
      <MarketplaceCampaignList
        campaigns={(campaigns ?? []).map((c) => ({
          ...c,
          per_advocate_compensation: Number(c.per_advocate_compensation),
        }))}
      />
    </DashboardShell>
  );
}
