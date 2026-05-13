"use client";

import { SectionReveal } from "@/components/sections/SectionReveal";
import { StatCard } from "@/components/ui/StatCard";

const STATS = [
  { number: "15+", label: "user types served" },
  { number: "50", label: "languages supported" },
  { number: "50", label: "states covered for board prep" },
  { number: "0", label: "ads, ever" },
] as const;

export function NumbersRow() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/10 bg-navy py-16 md:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 className="sr-only">Sif&apos;s Gold by the numbers</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((item) => (
              <StatCard
                key={item.label}
                number={item.number}
                label={item.label}
                className="rounded-brand-md border border-gold/25 bg-navy-deep/60 p-5 text-center"
              />
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
