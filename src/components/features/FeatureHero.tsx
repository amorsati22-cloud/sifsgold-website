"use client";

import type { LucideIcon } from "lucide-react";
import { StarfieldBackground } from "@/components/decorative/StarfieldBackground";
import { useTheme } from "@/components/theme/ThemeProvider";

export function FeatureHero({
  eyebrow,
  title,
  tagline,
  icon: Icon,
  primaryHref = "#audience-waitlist",
  primaryLabel = "Join Sif's Circle",
  secondaryHref = "/features",
  secondaryLabel = "All features",
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const { colors } = useTheme();

  return (
    <header className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-gold/15 bg-navy">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <StarfieldBackground />
      </div>
      <div className="relative z-10 mx-auto max-w-content px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-gold-body">{eyebrow}</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold md:h-20 md:w-20">
            <Icon className="h-8 w-8 md:h-10 md:w-10" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1
              className="font-heading text-4xl !font-black leading-tight text-gold md:text-5xl lg:text-6xl"
              style={{
                color: colors.gold,
              }}
            >
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90 md:text-xl">{tagline}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 text-center font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
          >
            {primaryLabel}
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-center font-body text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
