import "server-only";

import type Stripe from "stripe";
import {
  getPricingTierById,
  PRICING_CONFIG,
  tierHasFreeTrial,
  type PricingTier,
} from "@/data/pricing";
import { getStripePriceId, getStripeProductRow } from "@/data/stripe-products";
import { assertStripeProductsReady } from "@/lib/stripe/server";

export type SubscriptionBilling = "monthly" | "annual";

export function resolveCheckoutTier(tierId: string): PricingTier | null {
  return getPricingTierById(tierId);
}

export function tierSupportsCheckout(tier: PricingTier): boolean {
  if (tier.isFree || tier.monthlyPrice === 0) return false;
  if (tier.monthlyPrice === null || tier.annualPrice === null) return false;
  if (tier.ctaType === "contact") return false;
  return true;
}

export function getCheckoutPriceId(
  tierId: string,
  billing: SubscriptionBilling,
): string {
  const row = getStripeProductRow(tierId);
  if (!row) {
    throw new Error("Unknown subscription tier");
  }
  const priceId =
    billing === "monthly" ? row.stripePriceMonthlyId : row.stripePriceAnnualId;
  assertStripeProductsReady(priceId);
  return priceId;
}

export function buildSubscriptionCheckoutSessionParams(
  tier: PricingTier,
  billing: SubscriptionBilling,
  options: { email?: string; siteUrl: string },
): Stripe.Checkout.SessionCreateParams {
  const priceId = getCheckoutPriceId(tier.id, billing);
  const trialDays = tierHasFreeTrial(tier) ? PRICING_CONFIG.freeTrialDays : undefined;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${options.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.siteUrl}/checkout/cancel?tier=${encodeURIComponent(tier.id)}`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    automatic_tax: { enabled: true },
    customer_email: options.email,
    metadata: {
      tierId: tier.id,
      billing,
      source: "website",
    },
    subscription_data: {
      metadata: {
        tierId: tier.id,
        billing,
        source: "website",
      },
      ...(trialDays
        ? { trial_period_days: trialDays }
        : {}),
    },
  };

  return params;
}
