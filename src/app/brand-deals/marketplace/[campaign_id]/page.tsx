import Link from "next/link";
import { ApplicationForm } from "@/components/brand-deals/ApplicationForm";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ campaign_id: string }> };

export default async function MarketplaceCampaignPage({ params }: Props) {
  const { campaign_id } = await params;
  const supabase = await createClient();

  const { data: campaign } = supabase
    ? await supabase.from("brand_campaigns").select("*").eq("id", campaign_id).single()
    : { data: null };

  if (!campaign) {
    return <p className="mx-auto max-w-content px-4 py-16 font-body text-cream">Campaign not found.</p>;
  }

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/brand-deals/marketplace" className="font-body text-sm text-gold hover:underline">
        ← Marketplace
      </Link>
      <h1 className="mt-4 font-heading text-3xl text-gold">{campaign.title}</h1>
      <p className="mt-4 font-body text-cream/90">{campaign.description}</p>

      <dl className="mt-6 grid gap-3 font-body text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gold-body">Compensation</dt>
          <dd className="text-cream">{formatCurrency(Number(campaign.per_advocate_compensation))}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Apply by</dt>
          <dd className="text-cream">{formatDate(campaign.application_deadline)}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Deliver by</dt>
          <dd className="text-cream">{formatDate(campaign.delivery_deadline)}</dd>
        </div>
        <div>
          <dt className="text-gold-body">Type</dt>
          <dd className="capitalize text-cream">{campaign.campaign_type.replace(/_/g, " ")}</dd>
        </div>
      </dl>

      <section className="mt-8 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
        <h2 className="font-heading text-lg text-gold">FTC disclosure requirement</h2>
        <pre className="mt-2 whitespace-pre-wrap font-body text-xs text-gold-body">
          {campaign.ftc_disclosure_template}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-gold">Apply</h2>
        <div className="mt-4">
          <ApplicationForm campaignId={campaign_id} />
        </div>
      </section>
    </div>
  );
}
