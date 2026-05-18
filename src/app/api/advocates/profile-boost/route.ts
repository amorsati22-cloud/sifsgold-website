import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/auth/site-url";
import { requireAdvocate } from "@/lib/brand-deals/auth-helpers";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BOOST_PRICES: Record<7 | 30, number> = { 7: 1900, 30: 4900 };

export async function POST(request: Request) {
  const advocate = await requireAdvocate();
  if (!advocate.authorized || !advocate.user) {
    return NextResponse.json({ error: "Advocate access required" }, { status: 403 });
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const body = await request.json();
  const days = body.days === 30 ? 30 : 7;
  const amount = BOOST_PRICES[days as 7 | 30];
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Advocate profile boost (${days} days)`,
            description: "Featured placement in the brand deal marketplace",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard/advocate/profile?boost=success`,
    cancel_url: `${siteUrl}/dashboard/advocate/profile?boost=cancelled`,
    metadata: {
      advocate_id: advocate.user.id,
      boost_days: String(days),
    },
  });

  return NextResponse.json({ url: session.url });
}
