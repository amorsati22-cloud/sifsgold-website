import { NextResponse } from "next/server";
import type { CampaignDeliverableSpec } from "@/lib/brand-deals/types";
import { requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string; app_id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const brand = await requireBrandPartner();
  if (!brand.authorized || !brand.supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await request.json()) as { action: "accept" | "reject"; review_notes?: string };
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: application } = await brand.supabase
    .from("campaign_applications")
    .select("*, campaign:brand_campaigns(*)")
    .eq("id", params.app_id)
    .eq("campaign_id", params.id)
    .single();

  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const campaign = application.campaign as {
    brand_partner_id: string;
    per_advocate_compensation: number;
    compensation_type: string;
    deliverables: CampaignDeliverableSpec[];
    delivery_deadline: string;
  };

  if (campaign.brand_partner_id !== brand.user!.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.action === "reject") {
    await brand.supabase
      .from("campaign_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), review_notes: body.review_notes })
      .eq("id", params.app_id);
    return NextResponse.json({ ok: true });
  }

  const { data: contract, error: contractError } = await admin
    .from("campaign_contracts")
    .insert({
      campaign_id: params.id,
      advocate_id: application.advocate_id,
      application_id: params.app_id,
      compensation_amount: campaign.per_advocate_compensation,
      compensation_type: campaign.compensation_type,
      contract_terms: { campaign_title: (application.campaign as { title?: string }).title },
      status: "pending_signatures",
    })
    .select("*")
    .single();

  if (contractError) return NextResponse.json({ error: contractError.message }, { status: 500 });

  const specs = (campaign.deliverables ?? []) as CampaignDeliverableSpec[];
  for (const spec of specs) {
    for (let i = 0; i < (spec.count ?? 1); i++) {
      await admin.from("campaign_deliverables").insert({
        contract_id: contract.id,
        deliverable_type: spec.type,
        description: spec.requirements,
        due_date: campaign.delivery_deadline,
      });
    }
  }

  await brand.supabase
    .from("campaign_applications")
    .update({
      status: "accepted",
      reviewed_at: new Date().toISOString(),
      review_notes: body.review_notes,
      contract_id: contract.id,
    })
    .eq("id", params.app_id);

  return NextResponse.json({ contract });
}
