"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/sections/SectionReveal";

export function PreFooterCTA() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy-light/30 py-16 md:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 className="sr-only">Choose your path</h2>
        <SectionReveal className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <article className="rounded-brand-lg border border-gold/30 bg-navy-deep/75 p-6">
            <h3 className="text-2xl text-cream">Are you a pro?</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Explore tools built for service providers who need scheduling, growth, and education
              in one platform.
            </p>
            <Link
              href="/for-pros"
              className="group mt-5 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
            >
              <span className="group-hover:animate-gold-shimmer">See pro features</span>
            </Link>
          </article>

          <article className="rounded-brand-lg border border-cream/25 bg-navy-deep/75 p-6">
            <h3 className="text-2xl text-cream">Are you a client?</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Find trusted professionals faster, book confidently, and build long-term
              relationships with the people who understand your style.
            </p>
            <Link
              href="/for-clients"
              className="group mt-5 inline-flex items-center justify-center rounded-full border border-gold/60 px-5 py-2.5 text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/20"
            >
              <span className="group-hover:animate-gold-shimmer">See how it works</span>
            </Link>
          </article>
        </SectionReveal>
      </div>
    </section>
  );
}
