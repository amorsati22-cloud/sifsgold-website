import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { LaunchCountdown } from "@/components/sections/LaunchCountdown";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Fashion Expansion | Sif's Gold",
  description:
    "On June 30, 2026, Sif's Gold expands to fashion — one platform, both industries.",
};

const FASHION_USER_TYPES: { title: string; description: string }[] = [
  {
    title: "Models",
    description: "Digitized comp cards, go-see prep, and bookings tied to real jobs — not scattered DMs.",
  },
  {
    title: "Modeling Agencies",
    description: "Roster tools, cast packets, and compliance rails that keep minors and contracts auditable.",
  },
  {
    title: "Casting Directors",
    description: "Run calls, shortlists, and callbacks with the same booking rigor you expect on set.",
  },
  {
    title: "Fashion Designers",
    description: "Showrooms, lookbooks, and talent access connected to who actually wears the work.",
  },
  {
    title: "Clothing Brands",
    description: "Wholesale moments, showroom pulls, and pro-facing drops without losing brand control.",
  },
  {
    title: "Fashion Stylists",
    description: "Pulls, returns, and day-rate jobs with receipts — styled for how you really work.",
  },
  {
    title: "Showrooms",
    description: "Appointment-native floors with buyer history, holds, and conversion you can measure.",
  },
  {
    title: "Fashion Event Producers",
    description: "Runway and activation logistics with crew, glam, and vendor rails in one thread.",
  },
];

export default function FashionPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>Fashion Expansion — June 30, 2026</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Beauty and fashion. One platform.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            On June 30, Sif&apos;s Gold expands to serve every role in the
            fashion industry. The same platform. A new side.
          </p>
          <div className="mt-10">
            <GoldButton href="#waitlist" label="Join the waitlist" size="lg" />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <ul className="grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
          {FASHION_USER_TYPES.map((item) => (
            <li key={item.title}>
              <div className="relative flex h-full flex-col rounded-2xl border-2 border-gold/40 bg-gradient-to-b from-gold/10 via-navy-dark/80 to-navy-dark p-6 shadow-[0_0_32px_rgba(212,168,67,0.12)] transition hover:border-gold/70 hover:shadow-[0_0_48px_rgba(212,168,67,0.2)]">
                <div className="mb-4 inline-flex rounded-full border border-gold/50 bg-gold/15 p-2.5 text-gold">
                  <Crown className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-heading text-lg font-semibold text-offwhite">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          The beauty-fashion bridge.
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          A makeup artist available for fashion shoots. A casting director
          booking a beauty team for a runway show. Cross-side bookings,
          cross-side community — one platform, both industries.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          The Fashion Academy
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          The Fashion Academy launches with the fashion expansion — go-see
          mastery, contract literacy, minor model safety, and international
          market prep.
        </p>
      </SectionWrapper>

      <LaunchCountdown
        targetDate="2026-06-30T00:00:00"
        title="Countdown to June 30, 2026"
        footnote={null}
      />

      <WaitlistForm
        heading="Fashion side early access"
        id="waitlist"
        blurb="Join the waitlist for early fashion side access."
      />
    </div>
  );
}
