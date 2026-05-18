import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

type PortalBody = {
  customerId?: string;
};

export async function POST(request: Request) {
  let body: PortalBody;

  try {
    body = (await request.json()) as PortalBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const customerId = body.customerId?.trim();
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
