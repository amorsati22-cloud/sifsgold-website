"use client";

import { Check } from "lucide-react";
import type { PricingTier } from "@/data/pricing";

type BillingMode = "monthly" | "annual";

function formatUSD(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

function getSavings(tier: PricingTier) {
  if (tier.monthlyPrice === null || tier.annualPrice === null) return null;
  const yearlyAtMonthlyRate = tier.monthlyPrice * 12;
  const savings = yearlyAtMonthlyRate - tier.annualPrice;
  return savings > 0 ? savings : null;
}

function getPriceLabel(tier: PricingTier, billing: BillingMode) {
  if (tier.monthlyPrice === null || tier.annualPrice === null) {
    return { main: "Custom pricing", sub: "", isCustom: true };
  }
  if (tier.monthlyPrice === 0 && tier.annualPrice === 0) {
    return { main: "Free", sub: "", isCustom: false };
  }
  if (billing === "monthly") {
    return { main: formatUSD(tier.monthlyPrice), sub: "/mo", isCustom: false };
  }
  return { main: formatUSD(tier.annualPrice), sub: "/yr", isCustom: false };
}

export function TierCard({
  tier,
  billing,
  showBetaBadge = false,
}: {
  tier: PricingTier;
  billing: BillingMode;
  showBetaBadge?: boolean;
}) {
  const price = getPriceLabel(tier, billing);
  const savings = billing === "annual" ? getSavings(tier) : null;
  const showInfrastructureNote =
    !price.isCustom && tier.monthlyPrice !== 0 && tier.monthlyPrice !== null;

  return (
    <article
      tabIndex={0}
      aria-label={`${tier.name} plan`}
      className="group flex h-full flex-col rounded-brand-lg border border-gold/40 bg-cream p-6 text-navy transition-all duration-brand-medium hover:-translate-y-1 hover:border-gold hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-gold focus-visible:shadow-lg"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tier.isPopular ? (
          <span className="rounded-full border border-teal/60 bg-teal/10 px-2.5 py-1 text-xs font-semibold text-navy">
            Popular
          </span>
        ) : null}
        {showBetaBadge || tier.isBeta ? (
          <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-navy">
            Beta pricing - locks at launch
          </span>
        ) : null}
      </div>

      <h3 className="font-heading text-2xl text-gold">{tier.name}</h3>
      <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-navy">
        {price.main}
        {price.sub ? <span className="ml-1 text-base font-medium text-navy/70">{price.sub}</span> : null}
      </p>
      {billing === "annual" && tier.annualPrice !== null && !price.isCustom ? (
        <p className="mt-2 text-sm text-navy/70">Billed {formatUSD(tier.annualPrice)}/year</p>
      ) : null}
      {savings ? (
        <p className="mt-2 inline-flex w-fit rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-navy">
          Save {formatUSD(savings)}/year
        </p>
      ) : null}

      <ul className="mt-5 space-y-2 text-sm text-navy/85">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {showInfrastructureNote ? (
        <p className="mt-4 text-xs text-navy/65">
          Includes Stripe Connect routing, payment dispute resolution, and platform
          infrastructure. No per-booking platform fee.
        </p>
      ) : null}

      <button
        type="button"
        className="group mt-6 inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
      >
        <span className="group-hover:animate-gold-shimmer">{tier.ctaLabel}</span>
      </button>
    </article>
  );
}

