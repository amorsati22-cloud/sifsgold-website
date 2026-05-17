"use client";

import Link from "next/link";
import { StarfieldBackground } from "@/components/decorative/StarfieldBackground";
import { useTheme } from "@/components/theme/ThemeProvider";

export type AudienceHeroCTA = {
  label: string;
  href: string;
};

export function AudienceHero({
  eyebrow,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  badge,
}: {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCTA: AudienceHeroCTA;
  secondaryCTA: AudienceHeroCTA;
  badge?: string;
}) {
  const { colors } = useTheme();

  return (
    <header className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-gold/15 bg-navy">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <StarfieldBackground />
      </div>
      <div className="relative z-10 mx-auto max-w-content px-4 py-16 sm:px-6 md:px-8 md:py-24">
        {badge ? (
          <p className="inline-flex rounded-full border border-teal/50 bg-teal/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-cream">
            {badge}
          </p>
        ) : null}
        <p className={`font-body text-sm font-semibold uppercase tracking-[0.2em] text-gold-body ${badge ? "mt-4" : ""}`}>
          {eyebrow}
        </p>
        <h1
          className="mt-4 max-w-4xl bg-clip-text font-heading text-4xl !font-black leading-tight !text-transparent md:text-6xl"
          style={{
            backgroundImage: `linear-gradient(90deg, ${colors.cream}, ${colors.gold}, ${colors.teal})`,
          }}
        >
          {headline}
        </h1>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/85 md:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={primaryCTA.href}
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 text-center font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
          >
            {primaryCTA.label}
          </Link>
          <Link
            href={secondaryCTA.href}
            className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-center font-body text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10"
          >
            {secondaryCTA.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
