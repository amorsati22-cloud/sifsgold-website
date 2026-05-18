import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketplaceCampaignList } from "@/components/brand-deals/MarketplaceCampaignList";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { isAdvocateUserType } from "@/lib/auth-advocate";
import { isBrandUserType } from "@/lib/auth-brand";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";
import { createClient } from "@/lib/supabase/server";

export default async function BrandDealsMarketplacePage() {
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/brand-deals");

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
  const userType = profile?.user_type as string | undefined;

  if (!isAdvocateUserType(userType) && !isBrandUserType(userType)) {
    redirect("/advocates");
  }

  const { data: campaigns } = await supabase
    .from("brand_campaigns")
    .select(
      "id, title, description, per_advocate_compensation, application_deadline, campaign_type, objective, published_at",
    )
    .eq("status", "published")
    .eq("escrow_funded", true)
    .order("published_at", { ascending: false });

  const nav = isAdvocateUserType(userType) ? [...ADVOCATE_DASHBOARD_NAV] : [{ href: "/dashboard/brand-deals", label: "My campaigns" }];

  return (
    <DashboardShell
      title="Brand deal marketplace"
      description="Gold Partner campaigns for Sif's Advocates. FTC disclosures required on every sponsored post."
      nav={nav}
    >
      {isBrandUserType(userType) && (
        <GoldButton label="Post new deal" href="/brand-deals/new" variant="solid" size="sm" className="mb-6" />
      )}
      {isAdvocateUserType(userType) && (
        <p className="mb-6 font-body text-sm text-gold-body">
          <Link href="/dashboard/advocate" className="text-gold hover:underline">
            ← Advocate dashboard
          </Link>
        </p>
      )}
      <MarketplaceCampaignList
        campaigns={(campaigns ?? []).map((c) => ({
          ...c,
          per_advocate_compensation: Number(c.per_advocate_compensation),
        }))}
        linkPrefix="/brand-deals"
      />
    </DashboardShell>
  );
}
