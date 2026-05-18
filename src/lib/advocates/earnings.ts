import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { FTC_NEC_THRESHOLD_USD } from "@/lib/brand-deals/constants";

export type EarningSourceType =
  | "brand_deal"
  | "subscription_referral"
  | "product_affiliate"
  | "booking_referral";

const PLATFORM_RATES: Record<EarningSourceType, number> = {
  brand_deal: 0.3,
  subscription_referral: 0.15,
  product_affiliate: 0.15,
  booking_referral: 0.15,
};

export function splitAdvocateEarning(
  sourceType: EarningSourceType,
  grossAmount: number,
): { amount: number; platformFee: number; netToAdvocate: number } {
  const amount = Math.round(grossAmount * 100) / 100;
  const rate = PLATFORM_RATES[sourceType];
  const platformFee = Math.round(amount * rate * 100) / 100;
  const netToAdvocate = Math.round((amount - platformFee) * 100) / 100;
  return { amount, platformFee, netToAdvocate };
}

export async function recordAdvocateEarning(
  admin: SupabaseClient,
  params: {
    advocateId: string;
    sourceType: EarningSourceType;
    sourceId?: string | null;
    grossAmount: number;
    status?: "pending" | "processing" | "paid";
    stripeTransferId?: string | null;
  },
) {
  const { amount, platformFee, netToAdvocate } = splitAdvocateEarning(params.sourceType, params.grossAmount);
  const taxYear = new Date().getFullYear();

  const { data, error } = await admin
    .from("advocate_earnings")
    .insert({
      advocate_id: params.advocateId,
      source_type: params.sourceType,
      source_id: params.sourceId ?? null,
      amount,
      platform_fee: platformFee,
      net_to_advocate: netToAdvocate,
      status: params.status ?? (params.stripeTransferId ? "paid" : "pending"),
      stripe_transfer_id: params.stripeTransferId ?? null,
      tax_year: taxYear,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const { data: existing } = await admin
    .from("advocate_annual_earnings")
    .select("gross_earnings")
    .eq("advocate_id", params.advocateId)
    .eq("tax_year", taxYear)
    .maybeSingle();

  const newGross = Number(existing?.gross_earnings ?? 0) + netToAdvocate;
  await admin.from("advocate_annual_earnings").upsert({
    advocate_id: params.advocateId,
    tax_year: taxYear,
    gross_earnings: newGross,
    nec_generated: newGross >= FTC_NEC_THRESHOLD_USD,
    nec_generated_at: newGross >= FTC_NEC_THRESHOLD_USD ? new Date().toISOString() : null,
  });

  return { earningId: data.id as string, netToAdvocate, platformFee, taxYear, ytdGross: newGross };
}

export async function getYtdGross(admin: SupabaseClient, advocateId: string, taxYear?: number) {
  const year = taxYear ?? new Date().getFullYear();
  const { data } = await admin
    .from("advocate_earnings")
    .select("net_to_advocate")
    .eq("advocate_id", advocateId)
    .eq("tax_year", year)
    .in("status", ["paid", "processing", "pending"]);

  return (data ?? []).reduce((sum, row) => sum + Number(row.net_to_advocate ?? 0), 0);
}
