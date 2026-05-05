import type { Metadata } from "next";
import {
  BarChart3,
  LayoutGrid,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { StatCard } from "@/components/ui/StatCard";

export const metadata: Metadata = {
  title: "For Beauty Schools | Sif's Gold",
  description:
    "Roster management, clinic scheduling, board pass rate tracking, and exam readiness — built for cosmetology schools.",
};

export default function ForSchoolsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Beauty Schools</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Manage your school. Graduate your students.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Roster management, clinic scheduling, board pass rate tracking, and a
            direct line to your students&apos; exam readiness — all in one
            platform built for cosmetology schools.
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
              icon={<TrendingUp className="h-6 w-6" aria-hidden />}
              title="Student Progress Tracking"
              description="See hours, clinic performance, and readiness trends across cohorts — without spreadsheets chasing you."
            />
          </li>
          <li>
            <FeatureCard
              icon={<LayoutGrid className="h-6 w-6" aria-hidden />}
              title="Clinic Floor Management"
              description="Schedule real clients on your clinic floor with clarity for students, instructors, and front desk."
            />
          </li>
          <li>
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" aria-hidden />}
              title="Board Pass Rate analytics"
              description="Track outcomes by class, instructor focus, and prep intensity so you can coach what moves the needle."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Trophy className="h-6 w-6" aria-hidden />}
              title="The Hall of Gold"
              description="A recognition wall for standout students and milestones — motivation that lives inside the platform."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <StatCard
              number="$99/mo"
              label="School Standard"
              sublabel="Core tools for running programs and clinics."
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <StatCard
              number="$199/mo"
              label="School Partner"
              sublabel="Deeper analytics, recognition, and partner-level support."
            />
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-center text-lg text-white/70 lg:mx-auto lg:text-center">
          Connect your school to your students&apos; platform experience.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <p className="max-w-3xl text-pretty font-heading text-2xl font-medium leading-snug text-offwhite sm:text-3xl">
          Verified schools display their accreditation status on Scout —
          visible to students choosing where to enroll.
        </p>
      </SectionWrapper>

      <WaitlistForm heading="Get early access for your school." id="waitlist" />
    </div>
  );
}
