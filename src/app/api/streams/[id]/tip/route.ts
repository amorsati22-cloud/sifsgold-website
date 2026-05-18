import { NextResponse } from "next/server";
import { getStreamerConnectAccount } from "@/lib/streaming/connect";
import { splitTip } from "@/lib/streaming/tips-payout";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };
type Body = { amount: number; message?: string };

export async function POST(request: Request, { params }: Params) {
  const { id: streamId } = await params;
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments unavailable" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const body = (await request.json()) as Body;
  const amount = Number(body.amount);
  if (!amount || amount < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: stream } = await admin
    .from("live_streams")
    .select("id, streamer_id, accepts_tips, minimum_tip, status, title")
    .eq("id", streamId)
    .maybeSingle();

  if (!stream || stream.status !== "live") {
    return NextResponse.json({ error: "Stream not live" }, { status: 400 });
  }
  if (!stream.accepts_tips) {
    return NextResponse.json({ error: "Tips disabled" }, { status: 400 });
  }
  if (amount < Number(stream.minimum_tip)) {
    return NextResponse.json(
      { error: `Minimum tip is $${stream.minimum_tip}` },
      { status: 400 },
    );
  }

  const connect = await getStreamerConnectAccount(stream.streamer_id as string);
  if (!connect.onboarded) {
    return NextResponse.json(
      { error: "Streamer has not completed payout setup" },
      { status: 400 },
    );
  }

  const stripe = getStripe()!;
  const { platformFee, netToStreamer } = splitTip(amount);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: "stream_tip",
      stream_id: streamId,
      streamer_id: stream.streamer_id as string,
      tipper_id: user?.id ?? "guest",
      platform_fee: String(platformFee),
      net_to_streamer: String(netToStreamer),
      message: body.message?.slice(0, 200) ?? "",
    },
  });

  return NextResponse.json({
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    platform_fee: platformFee,
    net_to_streamer: netToStreamer,
  });
}
