import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { ADVOCATE_BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { createClient } from "@/lib/supabase/server";

export default async function BrandDealsMarketplacePage() {
  const supabase = await createClient();

  const { data: campaigns } = supabase
    ? await supabase
        .from("brand_campaigns")
        .select("id, title, description, per_advocate_compensation, application_deadline, campaign_type, objective")
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
      <ul className="space-y-4">
        {(campaigns ?? []).map((c) => (
          <li key={c.id}>
            <Link
              href={`/brand-deals/marketplace/${c.id}`}
              className="block rounded-brand-md border border-gold/15 bg-navy-lift p-5 transition hover:border-gold/40"
            >
              <h2 className="font-heading text-xl text-gold">{c.title}</h2>
              <p className="mt-2 line-clamp-2 font-body text-sm text-cream/80">{c.description}</p>
              <p className="mt-3 font-body text-sm text-gold">
                {formatCurrency(Number(c.per_advocate_compensation))} · Apply by {formatDate(c.application_deadline)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {(campaigns ?? []).length === 0 && (
        <p className="font-body text-gold-body">No published campaigns. Check back soon.</p>
      )}
    </DashboardShell>
  );
}
