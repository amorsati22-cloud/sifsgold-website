// All IDs below are placeholders. Replace with real Stripe IDs after running
// scripts/create-stripe-products.ts (see Stripe Setup Checklist).

export type StripeProductMapping = {
  tierId: string;
  stripeProductId: string;
  stripePriceMonthlyId: string;
  stripePriceAnnualId: string;
  paymentLinkMonthly: string | null;
  paymentLinkAnnual: string | null;
};

const TIER_IDS = [
  "student-free",
  "student",
  "stylist-assistant-beauty",
  "licensed-pro-standard",
  "licensed-pro-pro",
  "licensed-pro-premium",
  "school-free",
  "school-pro",
  "school-premium",
  "school-enterprise",
  "med-spa-provider-individual",
  "solo-studio",
  "salon-standard",
  "salon-pro",
  "salon-premium",
  "tattoo-shop-small",
  "tattoo-shop-standard",
  "tattoo-shop-premium",
  "piercing-studio",
  "piercing-studio-pro",
  "fitness-studio-standard",
  "fitness-studio-pro",
  "fitness-studio-premium",
  "med-spa-standard",
  "med-spa-pro",
  "med-spa-premium",
  "barbershop-standard",
  "aspiring-model",
  "working-model",
  "stylist-assistant-fashion",
  "fashion-designer-standard",
  "fashion-designer-pro",
  "modeling-agency-boutique",
  "modeling-agency-standard",
  "modeling-agency-premium",
  "casting-director-indie",
  "casting-director-pro",
  "casting-director-premium",
  "showroom-boutique",
  "showroom-standard",
  "showroom-premium",
  "clothing-brand-standard",
  "clothing-brand-pro",
  "clothing-brand-plus",
  "fashion-event-producer-indie",
  "fashion-event-producer-pro",
  "fashion-event-producer-premium",
  "client-free",
  "client-plus",
  "storefront-starter",
  "storefront-standard",
  "storefront-plus",
  "brand-partner-discovery",
  "brand-partner-pro",
  "brand-partner-enterprise"
] as const;

export const stripeProducts: StripeProductMapping[] = TIER_IDS.map((tierId) => ({
  tierId,
  stripeProductId: `prod_PLACEHOLDER_${tierId}`,
  stripePriceMonthlyId: `price_PLACEHOLDER_${tierId}_monthly`,
  stripePriceAnnualId: `price_PLACEHOLDER_${tierId}_annual`,
  paymentLinkMonthly: null,
  paymentLinkAnnual: null,
}));

const byTierId = new Map(stripeProducts.map((row) => [row.tierId, row]));

export function getStripeProductRow(tierId: string): StripeProductMapping | undefined {
  return byTierId.get(tierId);
}

export function getStripePriceId(
  tierId: string,
  billing: "monthly" | "annual",
): string | undefined {
  const row = getStripeProductRow(tierId);
  if (!row) return undefined;
  return billing === "monthly" ? row.stripePriceMonthlyId : row.stripePriceAnnualId;
}
