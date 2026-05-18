import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { formatCurrency } from "@/lib/brand-deals/format";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

export default async function AdvocateDashboardPage() {
  const { supabase, user, advocate, ftc } = await requireAdvocateDashboard();

  const year = new Date().getFullYear();

  const { data: earningsYtd } = await supabase
    .from("advocate_earnings")
    .select("net_to_advocate, status")
    .eq("advocate_id", user.id)
    .eq("tax_year", year);

  const ytdTotal = (earningsYtd ?? []).reduce((s, r) => s + Number(r.net_to_advocate ?? 0), 0);

  const { count: completedDeals } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("advocate_id", user.id)
    .eq("status", "completed");

  const { count: inProgressDeals } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("advocate_id", user.id)
    .in("status", ["accepted", "pending"]);

  const { data: recentEarnings } = await supabase
    .from("advocate_earnings")
    .select("id, source_type, net_to_advocate, status, created_at")
    .eq("advocate_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const specialties = advocate?.specialty_tags ?? advocate?.specialties ?? [];
  let dealsQuery = supabase
    .from("brand_campaigns")
    .select("id, title, per_advocate_compensation, application_deadline, target_advocate_specialties")
    .eq("status", "published")
    .eq("escrow_funded", true)
    .order("published_at", { ascending: false })
    .limit(6);

  const { data: openDeals } = await dealsQuery;

  const matchedDeals = (openDeals ?? []).filter((d) => {
    const targets = (d.target_advocate_specialties as string[] | null) ?? [];
    if (targets.length === 0) return true;
    return specialties.some((s) =>
      targets.some((t) => t.toLowerCase().includes(String(s).toLowerCase())),
    );
  });

  const connectReady = Boolean(advocate?.stripe_connect_onboarded);

  return (
    <DashboardShell
      title="Advocate dashboard"
      description="Track earnings, brand deals, and FTC compliance in one place."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      {!connectReady && (
        <div className="mb-6 rounded-brand-md border border-amber-500/40 bg-amber-950/20 p-4">
          <p className="font-body text-sm text-cream">
            Complete Stripe Connect to receive payouts.
          </p>
          <GoldButton
            label="Finish onboarding"
            href="/dashboard/advocate/onboarding"
            variant="solid"
            size="sm"
            className="mt-3"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Earnings YTD" value={formatCurrency(ytdTotal)} />
        <KpiCard label="Deals completed" value={String(completedDeals ?? 0)} />
        <KpiCard label="Deals in progress" value={String(inProgressDeals ?? 0)} />
        <KpiCard label="FTC status" value={ftc.label} warn={ftc.suspended || ftc.strikes > 0} />
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-gold">Recent earnings</h2>
        <ul className="mt-4 space-y-2">
          {(recentEarnings ?? []).length === 0 ? (
            <li className="font-body text-sm text-gold-body">No earnings yet.</li>
          ) : (
            recentEarnings!.map((e) => (
              <li
                key={e.id}
                className="flex justify-between rounded-brand-sm border border-gold/15 bg-navy-lift px-4 py-3 font-body text-sm"
              >
                <span className="capitalize text-cream">{String(e.source_type).replace(/_/g, " ")}</span>
                <span className="text-gold">
                  {formatCurrency(Number(e.net_to_advocate))} · {e.status}
                </span>
              </li>
            ))
          )}
        </ul>
        <Link href="/dashboard/advocate/earnings" className="mt-3 inline-block text-sm text-gold hover:underline">
          View all earnings →
        </Link>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-gold">Brand deals for you</h2>
          <Link href="/dashboard/advocate/deals" className="text-sm text-gold hover:underline">
            Browse all
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {matchedDeals.length === 0 ? (
            <li className="font-body text-sm text-gold-body">No open deals match your specialties yet.</li>
          ) : (
            matchedDeals.map((d) => (
              <li key={d.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
                <Link href={`/brand-deals/${d.id}`} className="font-heading text-gold hover:underline">
                  {d.title}
                </Link>
                <p className="mt-1 font-body text-sm text-gold-body">
                  {formatCurrency(Number(d.per_advocate_compensation))} · Apply by{" "}
                  {new Date(d.application_deadline as string).toLocaleDateString()}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <GoldButton label="Marketplace" href="/brand-deals" variant="ghost" size="sm" />
        <GoldButton label="Edit profile" href="/dashboard/advocate/profile" variant="ghost" size="sm" />
      </div>
    </DashboardShell>
  );
}

function KpiCard({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={`rounded-brand-md border p-4 ${
        warn ? "border-amber-500/40 bg-amber-950/20" : "border-gold/15 bg-navy-lift"
      }`}
    >
      <p className="font-body text-xs uppercase tracking-wide text-gold-body">{label}</p>
      <p className="mt-2 font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}
