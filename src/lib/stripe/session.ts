import "server-only";

import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) {
    return null;
  }

  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });
  } catch (error) {
    console.error("[stripe] retrieveCheckoutSession failed", error);
    return null;
  }
}
