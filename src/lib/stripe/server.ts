import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

const PLACEHOLDER_KEY = "sk_test_placeholder";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || key === PLACEHOLDER_KEY) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const pub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  return Boolean(
    key &&
      pub &&
      key !== PLACEHOLDER_KEY &&
      pub !== "pk_test_placeholder",
  );
}

export function isPlaceholderStripeId(id: string): boolean {
  return id.includes("PLACEHOLDER");
}

export function assertStripeProductsReady(priceId: string): void {
  if (isPlaceholderStripeId(priceId)) {
    throw new Error(
      "Stripe products not yet created — see Stripe Setup Checklist",
    );
  }
}

export const STRIPE_SETUP_CHECKLIST_PATH = "/pricing#stripe-setup";
