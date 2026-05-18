import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { BRAND_DEALS_NAV } from "@/lib/dashboard/brand-deals-nav";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ campaign_id: string }> };

export default async function CampaignManagePage({ params }: Props) {
  const { campaign_id } = await params;
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: campaign } = await supabase
    .from("brand_campaigns")
    .select("*")
    .eq("id", campaign_id)
    .single();

  if (!campaign) return <p className="p-8 font-body text-cream">Campaign not found.</p>;

  const { count: applicantCount } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaign_id);

  const { data: contracts } = await supabase
    .from("campaign_contracts")
    .select("id, status, advocate:advocate_profiles(display_name)")
    .eq("campaign_id", campaign_id);

  return (
    <DashboardShell title={campaign.title} nav={BRAND_DEALS_NAV}>
      <div className="mb-6 flex flex-wrap gap-3">
        <GoldButton label="Review applicants" href={`/dashboard/brand-deals/${campaign_id}/applications`} variant="solid" size="sm" />
        <span className="rounded-brand-full border border-gold/30 px-3 py-1 font-body text-xs text-cream capitalize">
          {campaign.status}
        </span>
      </div>

      <dl className="grid gap-3 font-body text-sm text-cream/90 sm:grid-cols-2">
        <div>
          <dt className="text-gold-body">Budget</dt>
          <dd>{formatCurrency(Number(campaign.total_budget))}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Per advocate</dt>
          <dd>{formatCurrency(Number(campaign.per_advocate_compensation))}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Applicants</dt>
          <dd>{applicantCount ?? 0}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Apply by</dt>
          <dd>{formatDate(campaign.application_deadline)}</dd>
        </div>
      </dl>

      <h2 className="mt-10 font-heading text-xl text-gold">Active contracts</h2>
      <ul className="mt-4 space-y-2">
        {(contracts ?? []).map((c) => (
          <li key={c.id}>
            <Link
              href={`/dashboard/brand-deals/${campaign_id}/contracts/${c.id}`}
              className="block rounded-brand-sm border border-gold/15 px-4 py-3 font-body text-cream hover:border-gold/40"
            >
              {(c.advocate as unknown as { display_name: string })?.display_name} — {c.status}
            </Link>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}
