import type { Metadata } from "next";
import { Clock, Dna, Link2, Search } from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "For Clients | Sif's Gold",
  description:
    "Scout finds your perfect beauty professional by service, location, mood, and style. Book directly and build lasting relationships.",
};

const MOODS = [
  "Treat me",
  "Transform me",
  "Relax me",
  "Quick and clean",
  "Take care of me",
] as const;

export default function ForClientsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Clients</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Find your pro. Book in seconds.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Scout finds your perfect beauty professional by service, location,
            mood, and style. Book directly. Build relationships. Never start
            over with a new stylist again.
          </p>
          <div className="mt-10">
            <GoldButton href="#waitlist" label="Join the waitlist" size="lg" />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
          <li>
            <FeatureCard
              icon={<Search className="h-6 w-6" aria-hidden />}
              title="Scout Discovery"
              description="Match by service, neighborhood, vibe, and the look you want — not endless scrolling through random listings."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Dna className="h-6 w-6" aria-hidden />}
              title="Style DNA quiz"
              description="Dial in preferences and guardrails so Scout learns what your version of great actually means."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Link2 className="h-6 w-6" aria-hidden />}
              title="Gold Chain loyalty"
              description="Loyalty with each pro you book — recognition and perks that follow the relationship, not just one salon brand."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Clock className="h-6 w-6" aria-hidden />}
              title="Beauty Clock rebooking windows"
              description="Smart windows so you land back in the chair right when your color, cut, or skin routine needs you."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Book by how you feel today.
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          Pick your mood and Scout shows the right services and professionals
          for how you feel right now.
        </p>
        <div
          className="mt-10 flex flex-wrap gap-3"
          role="group"
          aria-label="Mood booking options"
        >
          {MOODS.map((mood) => (
            <button
              key={mood}
              type="button"
              className="rounded-full border-2 border-gold bg-transparent px-5 py-2.5 text-sm font-semibold text-gold shadow-[0_0_0_1px_rgba(212,168,67,0.15)] transition hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(212,168,67,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98]"
            >
              {mood}
            </button>
          ))}
        </div>
      </SectionWrapper>

      <WaitlistForm heading="Find your pro at launch." id="waitlist" />
    </div>
  );
}
