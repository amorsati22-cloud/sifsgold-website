import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
function centsFromDecimal(amount: number): number {
  return Math.round(amount * 100);
}
import { getStripe } from "@/lib/stripe";

export async function createEscrowPaymentIntent(params: {
  campaignId: string;
  brandPartnerId: string;
  totalBudget: number;
  brandEmail?: string;
}): Promise<{ clientSecret: string | null; paymentIntentId: string | null; error?: string }> {
  const stripe = getStripe();
  if (!stripe) return { clientSecret: null, paymentIntentId: null, error: "Stripe not configured" };

  const intent = await stripe.paymentIntents.create({
    amount: centsFromDecimal(params.totalBudget),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    receipt_email: params.brandEmail,
    metadata: {
      type: "brand_campaign_escrow",
      campaign_id: params.campaignId,
      brand_partner_id: params.brandPartnerId,
    },
    description: `Brand campaign escrow — ${params.campaignId}`,
  });

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
  };
}

export async function markEscrowFunded(
  admin: SupabaseClient,
  campaignId: string,
  paymentIntentId: string,
  amount: number,
): Promise<void> {
  await admin
    .from("brand_campaigns")
    .update({
      escrow_funded: true,
      escrow_amount: amount,
      stripe_payment_intent_id: paymentIntentId,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", campaignId);
}

export async function refundEscrow(
  admin: SupabaseClient,
  campaignId: string,
): Promise<{ ok: boolean; error?: string }> {
  const stripe = getStripe();
  const { data: campaign } = await admin
    .from("brand_campaigns")
    .select("stripe_payment_intent_id, escrow_amount")
    .eq("id", campaignId)
    .single();

  if (!campaign?.stripe_payment_intent_id || !stripe) {
    return { ok: false, error: "No escrow to refund" };
  }

  try {
    await stripe.refunds.create({ payment_intent: campaign.stripe_payment_intent_id });
    await admin
      .from("brand_campaigns")
      .update({ status: "closed", escrow_funded: false })
      .eq("id", campaignId);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Refund failed" };
  }
}
