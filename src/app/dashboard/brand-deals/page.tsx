import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { createClient } from "@/lib/supabase/server";

export default async function BrandDealsDashboardPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: campaigns } = await supabase
    .from("brand_campaigns")
    .select("*")
    .eq("brand_partner_id", user.id)
    .order("created_at", { ascending: false });

  const published = (campaigns ?? []).filter((c) => c.status === "published");
  const drafts = (campaigns ?? []).filter((c) => c.status === "draft");
  const totalSpent = (campaigns ?? [])
    .filter((c) => c.escrow_funded)
    .reduce((s, c) => s + Number(c.escrow_amount ?? 0), 0);

  return (
    <DashboardShell
      title="Brand Deal Marketplace"
      description="Post campaigns for Sif's Advocates in The Gold Collective. Escrow-funded deals with FTC §255 compliance built in."
      nav={BRAND_DEALS_NAV}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Kpi label="Total escrow funded" value={formatCurrency(totalSpent)} />
        <Kpi label="Active campaigns" value={String(published.length)} />
        <Kpi label="Drafts" value={String(drafts.length)} />
      </div>

      <GoldButton label="+ New campaign" href="/dashboard/brand-deals/new" variant="solid" size="sm" className="mb-8" />

      <section>
        <h2 className="font-heading text-xl text-gold">Campaigns</h2>
        <ul className="mt-4 space-y-3">
          {(campaigns ?? []).map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/brand-deals/${c.id}`}
                className="block rounded-brand-md border border-gold/15 bg-navy-lift p-4 transition hover:border-gold/40"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-heading text-lg text-cream">{c.title}</span>
                  <span className="font-body text-sm capitalize text-gold-body">{c.status}</span>
                </div>
                <p className="mt-1 font-body text-sm text-cream/70">
                  Budget {formatCurrency(Number(c.total_budget))} · Apply by {formatDate(c.application_deadline)}
                </p>
                {c.escrow_funded && (
                  <p className="mt-1 font-body text-xs text-teal">Escrow funded</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {(campaigns ?? []).length === 0 && (
          <p className="mt-4 font-body text-gold-body">No campaigns yet. Create your first Gold Partner campaign.</p>
        )}
      </section>
    </DashboardShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-md border border-gold/20 bg-navy-lift p-4">
      <p className="font-body text-xs uppercase text-gold-body">{label}</p>
      <p className="mt-1 font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}

