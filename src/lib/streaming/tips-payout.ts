import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { STREAM_TIP_PLATFORM_FEE_RATE } from "@/lib/streaming/types";
import { getStreamerConnectAccount } from "@/lib/streaming/connect";
import { getStripe } from "@/lib/stripe/server";

export function splitTip(amount: number, feeRate = STREAM_TIP_PLATFORM_FEE_RATE) {
  const rounded = Math.round(amount * 100) / 100;
  const platformFee = Math.round(rounded * feeRate * 100) / 100;
  const netToStreamer = Math.round((rounded - platformFee) * 100) / 100;
  return { amount: rounded, platformFee, netToStreamer };
}

export async function completeTipPayout(
  admin: SupabaseClient,
  params: {
    streamId: string;
    streamerId: string;
    tipperId: string | null;
    amount: number;
    message?: string;
    paymentIntentId: string;
  },
): Promise<{ ok: boolean; tipId?: string; error?: string }> {
  const { amount, platformFee, netToStreamer } = splitTip(params.amount);
  const stripe = getStripe();
  const connect = await getStreamerConnectAccount(params.streamerId);

  let stripeTransferId: string | undefined;
  let payoutStatus: "pending" | "completed" | "failed" = "pending";

  if (stripe && connect.accountId && connect.onboarded && netToStreamer > 0) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(netToStreamer * 100),
        currency: "usd",
        destination: connect.accountId,
        metadata: {
          stream_id: params.streamId,
          payment_intent_id: params.paymentIntentId,
          type: "stream_tip",
        },
      });
      stripeTransferId = transfer.id;
      payoutStatus = "completed";
    } catch (err) {
      payoutStatus = "failed";
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Transfer failed",
      };
    }
  }

  const { data: tip, error } = await admin
    .from("stream_tips")
    .insert({
      stream_id: params.streamId,
      tipper_id: params.tipperId,
      streamer_id: params.streamerId,
      amount,
      message: params.message ?? null,
      stripe_payment_intent_id: params.paymentIntentId,
      platform_fee: platformFee,
      net_to_streamer: netToStreamer,
      payout_status: payoutStatus,
      stripe_transfer_id: stripeTransferId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: true, tipId: undefined };
    return { ok: false, error: error.message };
  }

  const { data: stream } = await admin
    .from("live_streams")
    .select("total_tips_received")
    .eq("id", params.streamId)
    .single();

  await admin
    .from("live_streams")
    .update({
      total_tips_received:
        Number(stream?.total_tips_received ?? 0) + amount,
    })
    .eq("id", params.streamId);

  return { ok: true, tipId: tip?.id as string };
}
