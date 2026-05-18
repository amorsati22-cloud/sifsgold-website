import { NextResponse } from "next/server";
import { recordFtcStrikeIfNeeded, verifyFtcDisclosureOnUrl } from "@/lib/brand-deals/ftc-verification";
import { triggerDeliverablePayout } from "@/lib/brand-deals/payout-engine";
import { requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string; del_id: string } };

export async function POST(request: Request, { params }: Params) {
  const brand = await requireBrandPartner();
  const admin = createAdminClient();
  if (!brand.authorized || !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await request.json()) as { action: "approve" | "revision"; revision_notes?: string };

  const { data: deliverable } = await admin
    .from("campaign_deliverables")
    .select("*, contract:campaign_contracts(*, campaign:brand_campaigns(*), advocate:advocate_profiles(stripe_connect_account_id))")
    .eq("id", params.del_id)
    .eq("contract_id", params.id)
    .single();

  if (!deliverable) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contract = deliverable.contract as {
    advocate_id: string;
    compensation_amount: number;
    campaign: { brand_partner_id: string; ftc_disclosure_template: string | null };
    advocate: { stripe_connect_account_id: string | null };
  };

  if (contract.campaign.brand_partner_id !== brand.user!.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.action === "revision") {
    await admin
      .from("campaign_deliverables")
      .update({
        brand_revision_requested: true,
        revision_notes: body.revision_notes,
        status: "pending",
      })
      .eq("id", params.del_id);
    return NextResponse.json({ ok: true });
  }

  if (deliverable.submitted_url) {
    const check = await verifyFtcDisclosureOnUrl(
      deliverable.submitted_url,
      contract.campaign.ftc_disclosure_template ?? undefined,
    );
    if (!check.compliant) {
      await recordFtcStrikeIfNeeded(
        admin,
        contract.advocate_id,
        params.del_id,
        "Brand rejected — FTC disclosure missing on live post",
      );
      return NextResponse.json({ error: "FTC disclosure not verified on post", verification: check }, { status: 400 });
    }
  }

  await admin
    .from("campaign_deliverables")
    .update({
      brand_approved: true,
      brand_approved_at: new Date().toISOString(),
      ftc_compliance_verified: true,
      status: "approved",
    })
    .eq("id", params.del_id);

  const { count: deliverableCount } = await admin
    .from("campaign_deliverables")
    .select("id", { count: "exact", head: true })
    .eq("contract_id", params.id);

  const total = deliverableCount ?? 1;
  const grossPerDeliverable = Number(contract.compensation_amount) / total;

  const payout = await triggerDeliverablePayout(admin, {
    contractId: params.id,
    deliverableId: params.del_id,
    grossAmount: grossPerDeliverable,
    advocateConnectAccountId: contract.advocate?.stripe_connect_account_id,
  });

  if (!payout.ok) {
    return NextResponse.json({ error: payout.error }, { status: 500 });
  }

  await admin
    .from("campaign_deliverables")
    .update({ status: "paid_out" })
    .eq("id", params.del_id);

  return NextResponse.json({ ok: true, payout_id: payout.payoutId });
}
