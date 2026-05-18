import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import type { StaffPayoutLine } from "@/types/salon";

export async function executeSalonPayouts(
  admin: SupabaseClient,
  params: {
    salonId: string;
    periodStart: string;
    periodEnd: string;
    lines: StaffPayoutLine[];
  },
): Promise<{ ok: boolean; results: { staff_id: string; ok: boolean; error?: string }[] }> {
  const stripe = getStripe();
  const results: { staff_id: string; ok: boolean; error?: string }[] = [];

  for (const line of params.lines) {
    if (line.net_owed <= 0) {
      results.push({ staff_id: line.staff_id, ok: true });
      continue;
    }

    let stripeTransferId: string | null = null;
    let status = "pending";

    if (stripe && line.stripe_connect_account_id) {
      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(line.net_owed * 100),
          currency: "usd",
          destination: line.stripe_connect_account_id,
          metadata: {
            salon_id: params.salonId,
            staff_id: line.staff_id,
            period_start: params.periodStart,
            period_end: params.periodEnd,
          },
        });
        stripeTransferId = transfer.id;
        status = "completed";
      } catch (err) {
        results.push({
          staff_id: line.staff_id,
          ok: false,
          error: err instanceof Error ? err.message : "Transfer failed",
        });
        continue;
      }
    }

    const { error } = await admin.from("salon_payouts").insert({
      salon_id: params.salonId,
      staff_id: line.staff_id,
      period_start: params.periodStart,
      period_end: params.periodEnd,
      gross_revenue: line.gross_revenue,
      commission_split: line.commission_split,
      booth_rent_deduction: line.booth_rent_deduction,
      other_deductions: line.other_deductions,
      net_owed: line.net_owed,
      stripe_transfer_id: stripeTransferId,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    });

    results.push({
      staff_id: line.staff_id,
      ok: !error,
      error: error?.message,
    });
  }

  return { ok: results.every((r) => r.ok), results };
}
