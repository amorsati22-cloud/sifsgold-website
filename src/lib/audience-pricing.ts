import type { PricingTier } from "@/data/pricing";
import { pricingTiers } from "@/data/pricing";

export function findTierById(id: string): PricingTier | null {
  for (const bucket of Object.values(pricingTiers)) {
    const tier = bucket.find((t) => t.id === id);
    if (tier) return tier;
  }
  return null;
}

export function findTiersByIds(ids: string[]): PricingTier[] {
  return ids.map((id) => findTierById(id)).filter((t): t is PricingTier => t !== null);
}
