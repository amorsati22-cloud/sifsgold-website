import type { LoyaltyTier } from "@/lib/loyalty/types";
import { DEFAULT_TIERS } from "@/lib/loyalty/types";

export function parseTiers(raw: unknown): LoyaltyTier[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_TIERS;
  return raw
    .map((t) => {
      const row = t as Record<string, unknown>;
      return {
        name: String(row.name ?? "Bronze"),
        threshold: Number(row.threshold ?? 0),
        perks: Array.isArray(row.perks) ? row.perks.map(String) : [],
      };
    })
    .sort((a, b) => a.threshold - b.threshold);
}

export function getTierForLifetimePoints(
  lifetimePoints: number,
  tiers: LoyaltyTier[],
): { current: LoyaltyTier; next: LoyaltyTier | null; nextThreshold: number | null } {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  let current = sorted[0];
  let next: LoyaltyTier | null = null;

  for (let i = 0; i < sorted.length; i++) {
    if (lifetimePoints >= sorted[i].threshold) {
      current = sorted[i];
      next = sorted[i + 1] ?? null;
    }
  }

  return {
    current,
    next,
    nextThreshold: next?.threshold ?? null,
  };
}

export function getTierPerks(tierName: string, tiers: LoyaltyTier[]): string[] {
  return tiers.find((t) => t.name === tierName)?.perks ?? [];
}
