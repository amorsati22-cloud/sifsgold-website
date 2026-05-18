import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

export default async function AdvocateDealsPage() {
  const { supabase, user, advocate } = await requireAdvocateDashboard();

  const specialties = advocate?.specialty_tags ?? advocate?.specialties ?? [];

  const { data: campaigns } = await supabase
    .from("brand_campaigns")
    .select("id, title, description, per_advocate_compensation, application_deadline, target_advocate_specialties")
    .eq("status", "published")
    .eq("escrow_funded", true)
    .order("published_at", { ascending: false });

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("id, status, applied_at, pitch, campaign:brand_campaigns(title, per_advocate_compensation)")
    .eq("advocate_id", user.id)
    .order("applied_at", { ascending: false });

  const matched = (campaigns ?? []).filter((c) => {
    const targets = (c.target_advocate_specialties as string[] | null) ?? [];
    if (targets.length === 0) return true;
    return specialties.some((s) =>
      targets.some((t) => t.toLowerCase().includes(String(s).toLowerCase())),
    );
  });

  return (
    <DashboardShell
      title="Brand deals"
      description="Browse open campaigns and track your applications."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <GoldButton label="Full marketplace" href="/brand-deals" variant="solid" size="sm" className="mb-8" />

      <h2 className="font-heading text-xl text-gold">Open deals (matched)</h2>
      <ul className="mt-4 mb-10 space-y-3">
        {matched.length === 0 ? (
          <li className="font-body text-sm text-gold-body">No matching deals right now.</li>
        ) : (
          matched.map((c) => (
            <li key={c.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <Link href={`/brand-deals/${c.id}`} className="font-heading text-lg text-gold hover:underline">
                {c.title}
              </Link>
              <p className="mt-2 line-clamp-2 font-body text-sm text-cream/80">{c.description}</p>
              <p className="mt-2 font-body text-sm text-gold-body">
                {formatCurrency(Number(c.per_advocate_compensation))} · Apply by {formatDate(c.application_deadline)}
              </p>
            </li>
          ))
        )}
      </ul>

      <h2 className="font-heading text-xl text-gold">Your applications</h2>
      <ul className="mt-4 space-y-3">
        {(applications ?? []).length === 0 ? (
          <li className="font-body text-sm text-gold-body">No applications yet.</li>
        ) : (
          applications!.map((a) => {
            const camp = a.campaign as { title: string; per_advocate_compensation?: number };
            return (
              <li key={a.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4 font-body text-sm">
                <p className="text-gold">{camp.title}</p>
                <p className="capitalize text-gold-body">Status: {a.status}</p>
                {a.pitch && <p className="mt-2 text-cream/70 line-clamp-2">{a.pitch}</p>}
              </li>
            );
          })
        )}
      </ul>
    </DashboardShell>
  );
}
