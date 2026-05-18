import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sifsgold.com";

export async function POST() {
  const stripe = getStripe();
  const supabase = await createClient();
  if (!stripe || !supabase) {
    return NextResponse.json({ error: "Billing unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  let customerId = customers.data[0]?.id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${SITE_URL}/dashboard/payments`,
  });

  return NextResponse.json({ url: session.url });
}
