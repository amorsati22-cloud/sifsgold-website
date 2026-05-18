import { NextResponse } from "next/server";
import {
  buildSubscriptionCheckoutSessionParams,
  getCheckoutPriceId,
  resolveCheckoutTier,
  tierSupportsCheckout,
  type SubscriptionBilling,
} from "@/lib/stripe/checkout";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

type CheckoutBody = {
  tierId?: string;
  billing?: SubscriptionBilling;
  email?: string;
};

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tierId = body.tierId?.trim();
  const billing = body.billing === "annual" ? "annual" : "monthly";

  if (!tierId) {
    return NextResponse.json({ error: "Missing tierId" }, { status: 400 });
  }

  const tier = resolveCheckoutTier(tierId);
  if (!tier) {
    return NextResponse.json({ error: "Unknown subscription tier" }, { status: 404 });
  }

  if (!tierSupportsCheckout(tier)) {
    return NextResponse.json(
      { error: "This tier is not available for self-serve checkout" },
      { status: 400 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    getCheckoutPriceId(tier.id, billing);

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add your API keys to continue." },
        { status: 503 },
      );
    }

    const params = buildSubscriptionCheckoutSessionParams(tier, billing, {
      email: body.email?.trim() || undefined,
      siteUrl,
    });
    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create checkout session";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
