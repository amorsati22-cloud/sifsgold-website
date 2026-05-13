"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  CalendarClock,
  Camera,
  HeartPulse,
  Music2,
  Users,
} from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";

const PILLARS = [
  {
    id: "booking-scheduling",
    title: "Booking & Scheduling",
    description: "From walk-ins to four-hour bridal sessions.",
    icon: CalendarClock,
  },
  {
    id: "health-hub",
    title: "Health Hub",
    description: "Daily Pulse, Med Tracker, Calorie Tracker, cycle sync, wearable sync.",
    icon: HeartPulse,
  },
  {
    id: "photo-studio",
    title: "Photo Studio",
    description:
      "Portfolios, before/afters, look books, retouching, with industry-specific tools.",
    icon: Camera,
  },
  {
    id: "music",
    title: "Music",
    description:
      "Spotify and Apple Music integrated, plus Sif's Gold's own audio library and Originals.",
    icon: Music2,
  },
  {
    id: "education",
    title: "Education",
    description: "State board prep across 50 states, CE hours, audio textbooks, mentor matching.",
    icon: BookOpenCheck,
  },
  {
    id: "community",
    title: "Community",
    description:
      "The Gold Collective, Sif's Advocates, and the connections that make the industry work.",
    icon: Users,
  },
] as const;

export function WhatsInside() {
  return (
    <section
      id="features"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/10 bg-navy py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 className="text-center font-heading text-3xl text-cream md:text-4xl">What&apos;s Inside</h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-cream/80">
            Six connected pillars designed to replace scattered tools with one complete platform.
          </p>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <SectionReveal key={pillar.id} delay={index * 0.03}>
                <article
                  aria-label={pillar.title}
                  className="group flex h-full flex-col rounded-brand-lg border border-cream/20 bg-navy-light/35 p-6 transition-all duration-brand-medium hover:-translate-y-1 hover:border-gold/70 hover:ring-1 hover:ring-teal/60"
                >
                  <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-xl text-cream">{pillar.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/80">
                    {pillar.description}
                  </p>
                  <Link
                    href={`/features#${pillar.id}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-gold transition duration-brand-fast group-hover:text-gold-light"
                  >
                    Learn more
                  </Link>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
