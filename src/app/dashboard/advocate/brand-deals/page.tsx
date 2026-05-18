import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { ADVOCATE_BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { formatCurrency } from "@/lib/brand-deals/format";
import { createClient } from "@/lib/supabase/server";

export default async function AdvocateBrandDealsPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("*, campaign:brand_campaigns(title, status, per_advocate_compensation)")
    .eq("advocate_id", user.id)
    .order("applied_at", { ascending: false });

  const { data: contracts } = await supabase
    .from("campaign_contracts")
    .select("id, status, campaign:brand_campaigns(title)")
    .eq("advocate_id", user.id)
    .in("status", ["pending_signatures", "active"]);

  const { data: earnings } = await supabase
    .from("advocate_annual_earnings")
    .select("gross_earnings, tax_year, nec_generated")
    .eq("advocate_id", user.id)
    .eq("tax_year", new Date().getFullYear())
    .maybeSingle();

  return (
    <DashboardShell
      title="Brand deals"
      description="Campaigns from Gold Partners in The Gold Collective. FTC disclosures required on every sponsored post."
      nav={ADVOCATE_BRAND_DEALS_NAV}
    >
      <GoldButton label="Browse campaigns" href="/brand-deals/marketplace" variant="solid" size="sm" className="mb-8" />

      {earnings && (
        <p className="mb-6 font-body text-sm text-gold-body">
          YTD earnings: {formatCurrency(Number(earnings.gross_earnings))}
          {earnings.nec_generated ? " · 1099-NEC threshold met" : ""}
        </p>
      )}

      <h2 className="font-heading text-xl text-gold">Active contracts</h2>
      <ul className="mt-4 mb-8 space-y-2">
        {(contracts ?? []).map((c) => (
          <li key={c.id}>
            <Link href={`/dashboard/advocate/contracts/${c.id}`} className="text-gold hover:underline">
              {(c.campaign as { title: string }).title} — {c.status}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="font-heading text-xl text-gold">Applications</h2>
      <ul className="mt-4 space-y-3">
        {(applications ?? []).map((a) => (
          <li key={a.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4 font-body text-sm text-cream">
            <p className="text-gold">{(a.campaign as { title: string }).title}</p>
            <p className="capitalize text-gold-body">Status: {a.status}</p>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}
