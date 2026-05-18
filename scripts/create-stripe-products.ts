/**
 * Stripe Setup Checklist — run after adding real STRIPE_SECRET_KEY.
 *
 *   npx tsx scripts/create-stripe-products.ts
 *
 * Creates products/prices for each tier in src/data/stripe-products.ts and prints
 * IDs to paste into that file (and Payment Links where applicable).
 */
console.info(
  "Stripe product bootstrap is not automated yet. Create products in the Stripe Dashboard",
);
console.info(
  "or extend this script, then replace PLACEHOLDER IDs in src/data/stripe-products.ts.",
);
