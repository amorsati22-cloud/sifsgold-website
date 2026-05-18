import Link from "next/link";
import { redirect } from "next/navigation";
import { ApplicationForm } from "@/components/brand-deals/ApplicationForm";
import { GoldButton } from "@/components/ui/GoldButton";
import { isAdvocateUserType } from "@/lib/auth-advocate";
import { isBrandUserType } from "@/lib/auth-brand";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function BrandDealDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=/brand-deals/${id}`);

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
  const userType = profile?.user_type as string | undefined;

  const { data: campaign } = await supabase.from("brand_campaigns").select("*").eq("id", id).single();

  if (!campaign) {
    return <p className="mx-auto max-w-content px-4 py-16 font-body text-cream">Deal not found.</p>;
  }

  const isOwner = campaign.brand_partner_id === user.id;
  const canApply = isAdvocateUserType(userType);
  const canEdit = isBrandUserType(userType) && isOwner;

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/brand-deals" className="font-body text-sm text-gold hover:underline">
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
          <dt className="text-gold-body">Status</dt>
          <dd className="capitalize text-cream">{campaign.status}</dd>
        </div>
      </dl>

      {canEdit && (
        <GoldButton
          label="Manage campaign"
          href={`/dashboard/brand-deals/${id}`}
          variant="ghost"
          size="sm"
          className="mt-6"
        />
      )}

      <section className="mt-8 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
        <h2 className="font-heading text-lg text-gold">FTC disclosure requirement</h2>
        <pre className="mt-2 whitespace-pre-wrap font-body text-xs text-gold-body">
          {campaign.ftc_disclosure_template}
        </pre>
      </section>

      {canApply && campaign.status === "published" && campaign.escrow_funded && (
        <section className="mt-10">
          <h2 className="font-heading text-xl text-gold">Apply</h2>
          <div className="mt-4">
            <ApplicationForm campaignId={id} />
          </div>
        </section>
      )}
    </div>
  );
}
