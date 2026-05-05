import type { Metadata } from "next";
import {
  Activity,
  CalendarDays,
  Crown,
  LayoutDashboard,
} from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "For Salons | Sif's Gold",
  description:
    "The Floor dashboard: staff scheduling, chair management, booking flow, and salon analytics in one place.",
};

export default function ForSalonsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Salons</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            The platform your whole floor can use.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            The Floor dashboard manages your entire salon — staff scheduling,
            chair management, booking flow, and floor analytics all in one place.
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
              icon={<LayoutDashboard className="h-6 w-6" aria-hidden />}
              title="The Floor Dashboard"
              description="One command center for who is on the floor, what is booked, and what needs attention next."
            />
          </li>
          <li>
            <FeatureCard
              icon={<CalendarDays className="h-6 w-6" aria-hidden />}
              title="Staff Scheduling"
              description="Match talent to shifts and services with guardrails so coverage stays tight on busy days."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Crown className="h-6 w-6" aria-hidden />}
              title="Crown Chair Booth Rental"
              description="Support booth renters and house staff in the same system — clear economics, fewer side spreadsheets."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Activity className="h-6 w-6" aria-hidden />}
              title="Salon Analytics via Gold Pulse"
              description="Floor-level analytics that translate activity into decisions — not vanity charts you ignore."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Staff roles
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          Owner, Manager, Staff, and Front Desk roles — each sees what they
          need, nothing they don&apos;t.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Multi-location
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          Managing more than one location? Sif&apos;s Gold supports up to 5
          locations on the Salon Partner plan.
        </p>
      </SectionWrapper>

      <WaitlistForm heading="Get early access for your salon." id="waitlist" />
    </div>
  );
}
