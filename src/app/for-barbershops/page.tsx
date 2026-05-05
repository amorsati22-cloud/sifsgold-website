import type { Metadata } from "next";
import {
  BarChart3,
  LayoutPanelLeft,
  MessageSquare,
  Users,
} from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "For Barbershops | Sif's Gold",
  description:
    "The Fade: walk-in queue, Chair Fill Rate, and a barber-built community board — a full account type for barbershops, not a salon workaround.",
};

export default function ForBarbershopsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Barbershops</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Built for the barbershop. Not adapted from a salon tool.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            The Fade is Sif&apos;s Gold&apos;s barbershop-specific dashboard.
            Walk-in queue management, Chair Fill Rate analytics, and a community
            board built by barbers, for barbers.
          </p>
          <div className="mt-10">
            <GoldButton href="#waitlist" label="Join the waitlist" size="lg" />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <div className="rounded-2xl border-2 border-gold/50 bg-gold/5 p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Account architecture
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-offwhite sm:text-3xl">
            A full peer account type to salon — not a subtype, not a workaround.
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            Barbershops are first-class on Sif&apos;s Gold. You are not a
            &quot;salon with different defaults,&quot; not a buried setting, and
            not a bolt-on module. The barbershop account is its own lane — with
            data models, dashboards, and workflows built specifically for how
            barbershops operate day to day.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
          <li>
            <FeatureCard
              icon={<LayoutPanelLeft className="h-6 w-6" aria-hidden />}
              title="The Fade Dashboard"
              description="The barbershop command center: queue, chairs, community signal, and the metrics that matter to shops."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Users className="h-6 w-6" aria-hidden />}
              title="Walk-In Queue"
              description="Keep walk-ins fair, visible, and fast — alongside booked appointments without chaos at the door."
            />
          </li>
          <li>
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" aria-hidden />}
              title="Chair Fill Rate"
              description="See utilization the way barbers think about it — not generic occupancy, but real chair productivity."
            />
          </li>
          <li>
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" aria-hidden />}
              title="Barber Community Board"
              description="Industry-native space for drops, shoutouts, and shop culture — built for barbers, not borrowed from salon feed patterns."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Service types that speak barbershop.
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          Hot Towel, Taper/Fade, Beard Service, and every service type that
          matters in a barbershop — built into the booking system.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          App themes
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          The Barbershop and The Blade — two barbershop-exclusive app themes.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-heading text-xl text-offwhite">The Barbershop</h3>
            <p className="mt-2 text-sm text-white/60">
              Warm, classic shop energy — built for daytime floor hustle and
              client-facing calm.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-heading text-xl text-offwhite">The Blade</h3>
            <p className="mt-2 text-sm text-white/60">
              Sharp contrast and precision cues — for crews who live on lineups,
              details, and speed.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <WaitlistForm
        heading="Get early access for your barbershop."
        id="waitlist"
      />
    </div>
  );
}
