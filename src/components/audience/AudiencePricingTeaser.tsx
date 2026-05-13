"use client";

import Link from "next/link";
import type { PricingTier } from "@/data/pricing";
import { SectionReveal } from "@/components/sections/SectionReveal";

function formatTierPrice(tier: PricingTier): string {
  if (tier.isFree) return "Free";
  if (tier.monthlyPrice === null) return "Custom";
  return `$${tier.monthlyPrice}/mo`;
}

export function AudiencePricingTeaser({ tiers }: { tiers: PricingTier[] }) {
  if (tiers.length === 0) return null;

  return (
    <section className="border-b border-gold/10 bg-navy-light/15 py-16 md:py-20" aria-labelledby="audience-pricing-teaser-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 id="audience-pricing-teaser-heading" className="font-heading text-3xl text-gold md:text-4xl">
            Pricing snapshot
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-cream/80">
            Founding member window and trials apply on eligible tiers. See full details on the pricing page.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <li
                key={tier.id}
                className="flex flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5"
              >
                <p className="font-heading text-lg text-cream">{tier.name}</p>
                <p className="mt-2 font-body text-2xl font-bold text-gold">{formatTierPrice(tier)}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-cream/80">
                  {tier.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-gold bg-gold/10 px-6 py-3 font-body text-sm font-semibold text-gold transition duration-brand-fast hover:bg-gold/20"
            >
              See full pricing
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
