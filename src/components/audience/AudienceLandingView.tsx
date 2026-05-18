"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { AudienceHero } from "@/components/audience/AudienceHero";
import { ComplianceDisclosureSection } from "@/components/audience/ComplianceDisclosureSection";
import { FeatureCard } from "@/components/audience/FeatureCard";
import { HowItWorks } from "@/components/audience/HowItWorks";
import { AudienceFAQ } from "@/components/audience/AudienceFAQ";
import { AudienceWaitlistCTA } from "@/components/audience/AudienceWaitlistCTA";
import { AudiencePricingTeaser } from "@/components/audience/AudiencePricingTeaser";
import { findTiersByIds } from "@/lib/audience-pricing";
import { getAudienceIcon } from "@/components/audience/audience-icons";
import { ServicesMenuPreview } from "@/components/audience/ServicesMenuPreview";
import { isProAudienceSlug } from "@/lib/audience-pro-slugs";
import {
  getFashionHeroPrimaryCta,
  resolveAudienceWeb3Source,
} from "@/lib/fashion-audience";
import { isLive } from "@/lib/launch-dates";
import type { AudienceLandingConfig } from "@/types/audience-landing";

const defaultPrimaryCta = { label: "Join Sif's Circle", href: "#audience-waitlist" };
const secondaryCta = { label: "See pricing", href: "/pricing" };

function resolvePrimaryCta(config: AudienceLandingConfig) {
  if (config.launchIndustry === "fashion") {
    return getFashionHeroPrimaryCta();
  }
  return defaultPrimaryCta;
}

function resolveWaitlistCopy(config: AudienceLandingConfig) {
  if (config.launchIndustry === "fashion" && isLive("fashion")) {
    return {
      heading: "Get started with fashion on Sif's Gold",
      body: "Create your account, pick your tier, and connect portfolios, rosters, or line sheets in The Gold Collective.",
    };
  }
  return {
    heading: "Join Sif's Circle",
    body: "Get launch updates, founding-member perks when eligible, and a direct line to the team while we build with Sif's Advocates and Gold Partners.",
  };
}

export function AudienceLandingView({ config }: { config: AudienceLandingConfig }) {
  const tiers = findTiersByIds([...config.pricingTierIds]);
  const primaryCta = resolvePrimaryCta(config);
  const waitlistCopy = resolveWaitlistCopy(config);
  const web3Source = resolveAudienceWeb3Source(config);

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <AudienceHero
        eyebrow={config.eyebrow}
        headline={config.headline}
        subheadline={config.subheadline}
        primaryCTA={primaryCta}
        secondaryCTA={secondaryCta}
        badge={config.heroBadge}
        launchIndustry={config.launchIndustry}
        showLaunchCountdown={config.slug === "for-fashion"}
      />

      <section
        className="border-b border-gold/10 bg-navy py-16 md:py-20"
        aria-labelledby={`${config.slug}-features-heading`}
      >
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id={`${config.slug}-features-heading`} className="font-heading text-3xl text-gold md:text-4xl">
              Built for your lane
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-cream/80">
              Tools shaped with Sif&apos;s Advocates so workflows match how{" "}
              {config.eyebrow.toLowerCase()} actually operate inside The Gold Collective.
            </p>
            <ul className="mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
              {config.features.map((feature) => (
                <li key={feature.headline}>
                  <FeatureCard
                    icon={getAudienceIcon(feature.icon)}
                    headline={feature.headline}
                    description={feature.description}
                  />
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </section>

      {config.complianceDisclosure ? (
        <ComplianceDisclosureSection disclosure={config.complianceDisclosure} idPrefix={config.slug} />
      ) : null}

      <HowItWorks steps={config.steps} />

      {isProAudienceSlug(config.slug) ? <ServicesMenuPreview /> : null}

      <AudiencePricingTeaser tiers={tiers} />

      <section
        className="border-b border-gold/10 bg-navy-deep/40 py-14 md:py-16"
        aria-labelledby={`${config.slug}-testimonial-heading`}
      >
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id={`${config.slug}-testimonial-heading`} className="font-heading text-2xl text-gold md:text-3xl">
              Voices from the chair
            </h2>
            <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-cream/85 md:text-base">
              Coming from real Sif&apos;s Advocates and founding members at launch.
            </p>
          </SectionReveal>
        </div>
      </section>

      <AudienceFAQ faqs={config.faqs} idPrefix={config.slug} />

      <AudienceWaitlistCTA
        source={web3Source}
        idPrefix={config.slug}
        heading={waitlistCopy.heading}
        body={waitlistCopy.body}
      />

      <nav
        className="border-b border-gold/10 bg-navy py-10"
        aria-label="Related pages for this audience"
      >
        <div className="mx-auto flex max-w-content flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8 sm:px-6 md:px-8">
          <Link
            href="/pricing"
            className="text-center font-body text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Full pricing
          </Link>
          <Link
            href="/#features"
            className="text-center font-body text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Platform features
          </Link>
        </div>
      </nav>
    </div>
  );
}
