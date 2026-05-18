import { NextResponse } from "next/server";
import { notifyTipReceived } from "@/lib/notifications/integrations";
import { completeTipPayout } from "@/lib/streaming/tips-payout";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };
type Body = { payment_intent_id: string };

export async function POST(request: Request, { params }: Params) {
  const { id: streamId } = await params;
  const body = (await request.json()) as Body;
  const stripe = getStripe();
  const admin = createAdminClient();

  if (!stripe || !admin || !body.payment_intent_id) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const intent = await stripe.paymentIntents.retrieve(body.payment_intent_id);
  if (intent.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }
  if (intent.metadata?.stream_id !== streamId) {
    return NextResponse.json({ error: "Invalid payment" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const amount = intent.amount / 100;
  const result = await completeTipPayout(admin, {
    streamId,
    streamerId: intent.metadata.streamer_id,
    tipperId: user?.id ?? null,
    amount,
    message: intent.metadata.message || undefined,
    paymentIntentId: intent.id,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (result.tipId) {
    await notifyTipReceived(admin, {
      streamerId: intent.metadata.streamer_id,
      amount,
      streamId,
    });
    await admin.from("stream_comments").insert({
      stream_id: streamId,
      author_id: user?.id ?? null,
      content: `💛 tipped $${amount.toFixed(2)}${intent.metadata.message ? `: ${intent.metadata.message}` : ""}`,
      highlighted: true,
    });
  }

  return NextResponse.json({ ok: true, tip_id: result.tipId });
}
