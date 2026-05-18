import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ADVOCATE_REVENUE_SHARE,
  FTC_NEC_THRESHOLD_USD,
  PLATFORM_FEE_SHARE,
} from "@/lib/brand-deals/constants";
import { getStripe } from "@/lib/stripe";

export function splitCompensation(grossAmount: number): {
  amount: number;
  platformFee: number;
  netToAdvocate: number;
} {
  const amount = Math.round(grossAmount * 100) / 100;
  const netToAdvocate = Math.round(amount * ADVOCATE_REVENUE_SHARE * 100) / 100;
  const platformFee = Math.round(amount * PLATFORM_FEE_SHARE * 100) / 100;
  return { amount, platformFee, netToAdvocate };
}

export async function triggerDeliverablePayout(
  admin: SupabaseClient,
  params: {
    contractId: string;
    deliverableId: string;
    grossAmount: number;
    advocateConnectAccountId?: string | null;
  },
): Promise<{ ok: boolean; payoutId?: string; error?: string }> {
  const { amount, platformFee, netToAdvocate } = splitCompensation(params.grossAmount);
  const stripe = getStripe();

  let stripeTransferId: string | undefined;

  if (stripe && params.advocateConnectAccountId && netToAdvocate > 0) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(netToAdvocate * 100),
        currency: "usd",
        destination: params.advocateConnectAccountId,
        metadata: {
          contract_id: params.contractId,
          deliverable_id: params.deliverableId,
        },
      });
      stripeTransferId = transfer.id;
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Transfer failed" };
    }
  }

  const { data: payout, error } = await admin
    .from("campaign_payouts")
    .insert({
      contract_id: params.contractId,
      deliverable_id: params.deliverableId,
      amount,
      platform_fee: platformFee,
      net_to_advocate: netToAdvocate,
      stripe_transfer_id: stripeTransferId,
      status: stripeTransferId ? "completed" : "pending",
      completed_at: stripeTransferId ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  const { data: contract } = await admin
    .from("campaign_contracts")
    .select("advocate_id")
    .eq("id", params.contractId)
    .single();

  if (contract?.advocate_id) {
    const year = new Date().getFullYear();
    const { data: existing } = await admin
      .from("advocate_annual_earnings")
      .select("gross_earnings")
      .eq("advocate_id", contract.advocate_id)
      .eq("tax_year", year)
      .maybeSingle();

    const newGross = Number(existing?.gross_earnings ?? 0) + netToAdvocate;
    await admin.from("advocate_annual_earnings").upsert({
      advocate_id: contract.advocate_id,
      tax_year: year,
      gross_earnings: newGross,
      nec_generated: newGross >= FTC_NEC_THRESHOLD_USD,
      nec_generated_at: newGross >= FTC_NEC_THRESHOLD_USD ? new Date().toISOString() : null,
    });
  }

  return { ok: true, payoutId: payout?.id };
}
