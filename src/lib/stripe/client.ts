"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!key || key === "pk_test_placeholder") {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }

  return stripePromise;
}
