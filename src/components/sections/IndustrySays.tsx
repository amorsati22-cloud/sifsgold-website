"use client";

import { SectionReveal } from "@/components/sections/SectionReveal";

const PLACEHOLDERS = [
  { name: "Founding Member Slot 01", role: "Reserved", quote: "Reserved for our founding members" },
  { name: "Founding Member Slot 02", role: "Reserved", quote: "Reserved for our founding members" },
  { name: "Founding Member Slot 03", role: "Reserved", quote: "Reserved for our founding members" },
] as const;

function PlaceholderCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <article
      aria-label={`${name} testimonial placeholder`}
      className="h-full rounded-brand-lg border border-cream/20 bg-navy-deep/75 p-6"
    >
      <p className="text-sm font-semibold text-gold">{name}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-cream/60">{role}</p>
      <div className="mt-5 rounded-brand-md border border-gold/20 bg-navy-light/40 p-4">
        <p className="text-sm text-cream/85">{quote}</p>
      </div>
    </article>
  );
}

export function IndustrySays() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/10 bg-navy-light/30 py-16 md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 className="text-center font-heading text-3xl text-cream md:text-4xl">The Industry Says</h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-cream/85">
            Coming from real Sif&apos;s Advocates and founding members at launch.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.04} className="mt-10 md:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" aria-label="Testimonials">
            {PLACEHOLDERS.map((item) => (
              <div key={item.name} className="min-w-[85%] snap-center">
                <PlaceholderCard {...item} />
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.04} className="mt-10 hidden grid-cols-3 gap-5 md:grid">
          {PLACEHOLDERS.map((item) => (
            <PlaceholderCard key={item.name} {...item} />
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
