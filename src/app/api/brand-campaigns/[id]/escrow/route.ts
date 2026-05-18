import { NextResponse } from "next/server";
import { createEscrowPaymentIntent, markEscrowFunded } from "@/lib/brand-deals/escrow";
import { requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function POST(request: Request, { params }: Params) {
  const brand = await requireBrandPartner();
  if (!brand.authorized || !brand.supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: { payment_intent_id?: string; fund?: boolean } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const { data: campaign } = await brand.supabase
    .from("brand_campaigns")
    .select("*")
    .eq("id", params.id)
    .eq("brand_partner_id", brand.user!.id)
    .single();

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.fund) {
    const paymentIntentId = body.payment_intent_id ?? campaign.stripe_payment_intent_id;
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing payment intent" }, { status: 400 });
    }
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
    await markEscrowFunded(admin, params.id, paymentIntentId, Number(campaign.total_budget));
    return NextResponse.json({ ok: true, status: "published" });
  }

  const { data: authUser } = await brand.supabase.auth.getUser();
  const result = await createEscrowPaymentIntent({
    campaignId: params.id,
    brandPartnerId: brand.user!.id,
    totalBudget: Number(campaign.total_budget),
    brandEmail: authUser.user?.email,
  });

  if (result.error) return NextResponse.json({ error: result.error }, { status: 503 });

  await brand.supabase
    .from("brand_campaigns")
    .update({ stripe_payment_intent_id: result.paymentIntentId })
    .eq("id", params.id);

  return NextResponse.json({
    client_secret: result.clientSecret,
    payment_intent_id: result.paymentIntentId,
  });
}
