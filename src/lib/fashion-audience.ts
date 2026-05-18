import type { AudienceLandingConfig } from "@/types/audience-landing";
import { isLive } from "@/lib/launch-dates";

export const FASHION_AUDIENCE_SLUGS = [
  "for-fashion",
  "for-models",
  "for-modeling-agencies",
  "for-designers",
  "for-casting-directors",
  "for-showrooms",
  "for-clothing-brands",
  "for-fashion-events",
] as const;

export type FashionAudienceSlug = (typeof FASHION_AUDIENCE_SLUGS)[number];

export function isFashionAudienceSlug(slug: string): slug is FashionAudienceSlug {
  return (FASHION_AUDIENCE_SLUGS as readonly string[]).includes(slug);
}

export function resolveAudienceWeb3Source(config: AudienceLandingConfig): string {
  if (config.launchIndustry === "fashion" && isLive("fashion") && config.sourceSignup) {
    return config.sourceSignup;
  }
  return config.source;
}

export function getFashionHeroPrimaryCta() {
  if (isLive("fashion")) {
    return { label: "Get started", href: "/sign-up" };
  }
  return { label: "Reserve your spot", href: "#audience-waitlist" };
}
