"use client";

import type { ReactNode } from "react";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { AudienceWaitlistCTA } from "@/components/audience/AudienceWaitlistCTA";
import { FeatureFlow } from "@/components/features/FeatureFlow";
import { FeatureFAQ } from "@/components/features/FeatureFAQ";
import { FeatureGrid } from "@/components/features/FeatureGrid";
import { FeatureHero } from "@/components/features/FeatureHero";
import { getFeatureLucide } from "@/components/features/feature-lucide";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";

export function FeatureDeepDiveView({
  config,
  children,
  gridHeading = "What you get",
  flowHeading = "How it flows",
  gridIntro,
}: {
  config: FeatureDeepDiveConfig;
  children?: ReactNode;
  gridHeading?: string;
  flowHeading?: string;
  gridIntro?: string;
}) {
  const Icon = getFeatureLucide(config.heroIcon);

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <FeatureHero
        eyebrow={config.heroEyebrow}
        title={config.heroTitle}
        tagline={config.heroTagline}
        icon={Icon}
      />

      <section className="border-b border-gold/10 bg-navy py-14 md:py-16" aria-labelledby={`${config.slug}-what-heading`}>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id={`${config.slug}-what-heading`} className="font-heading text-2xl text-gold md:text-3xl">
              What it is
            </h2>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-cream/90 md:text-lg">
              {config.whatItIs}
            </p>
          </SectionReveal>
        </div>
      </section>

      <FeatureGrid idPrefix={config.slug} heading={gridHeading} intro={gridIntro} items={config.grid} />

      <FeatureFlow idPrefix={config.slug} heading={flowHeading} steps={config.flow} />

      <section className="border-b border-gold/10 bg-navy-deep/35 py-16 md:py-20" aria-labelledby={`${config.slug}-who-heading`}>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id={`${config.slug}-who-heading`} className="font-heading text-3xl text-gold md:text-4xl">
              Who benefits
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-cream/80">
              A pillar should lift more than one chair — here is how different members of The Gold Collective use it.
            </p>
            <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2">
              {config.whoBenefits.map((row) => (
                <li
                  key={row.label}
                  className="rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5"
                >
                  <p className="font-heading text-lg text-cream">{row.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{row.description}</p>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </section>

      {children}

      <FeatureFAQ faqs={config.faqs} idPrefix={config.slug} />

      <AudienceWaitlistCTA
        source={config.source}
        idPrefix={config.slug}
        heading="Join Sif's Circle"
        body="Get launch updates for this pillar, founding perks when you qualify, and a direct line to the team alongside Sif's Advocates and Gold Partners."
      />
    </div>
  );
}
