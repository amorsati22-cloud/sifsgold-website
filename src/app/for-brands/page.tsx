import type { Metadata } from "next";
import {
  BarChart3,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "For Brand Partners | Sif's Gold",
  description:
    "Place your products in front of licensed beauty professionals actively searching for tools for their craft.",
};

const TIERS = [
  {
    name: "Brand Starter",
    price: "$149/mo",
    blurb: "Test-and-learn with a lean always-on presence.",
    featured: false,
    features: [
      "1 active campaign lane",
      "Advocate applications & shortlist review",
      "Core performance reporting",
      "Standard compliance templates",
    ],
  },
  {
    name: "Brand Campaign",
    price: "$299/mo",
    blurb: "Scale coordinated drops with advocates who already use you.",
    featured: true,
    features: [
      "Up to 3 concurrent campaign lanes",
      "Campaign Brief Builder with saved templates",
      "FTC-compliant content approval queue",
      "Mid-funnel analytics & cohort exports",
    ],
  },
  {
    name: "Brand Premier",
    price: "$599/mo",
    blurb: "Own the narrative with premier analytics and white-glove support.",
    featured: false,
    features: [
      "Unlimited campaign lanes",
      "Dedicated advocate matching & quarterly reviews",
      "Full Brand Analytics Dashboard + API exports",
      "Priority legal review slots for disclosure updates",
    ],
  },
];

export default function ForBrandsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Brand Partners</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Connect your brand to the professionals who use it.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Sif&apos;s Gold is where beauty professionals work. Place your
            products in front of the right people — not consumers browsing
            feeds, but licensed professionals actively searching for tools for
            their craft.
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
              icon={<UsersRound className="h-6 w-6" aria-hidden />}
              title="Sif's Advocates Ambassador Network"
              description="Verified pros and students who apply to brands they already love — structured reach, not random DMs."
            />
          </li>
          <li>
            <FeatureCard
              icon={<FileText className="h-6 w-6" aria-hidden />}
              title="Campaign Brief Builder"
              description="Ship briefs with guardrails, deliverables, and timelines so advocates show up on-brand without endless email chains."
            />
          </li>
          <li>
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
              title="FTC-Compliant Content Approval"
              description="Review, annotate, and approve posts with disclosure checks baked in — documentation stays attached to the asset."
            />
          </li>
          <li>
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" aria-hidden />}
              title="Brand Analytics Dashboard"
              description="See which advocates, services, and regions actually move product — not vanity impressions from cold traffic."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          The Sif&apos;s Advocates network.
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          Sif&apos;s Advocates are verified professionals and students on the
          platform who apply to represent brands they genuinely use. Authentic
          reach, documented compliance, and direct conversion to product sales.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <h2 className="text-center font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Partner tiers
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/60">
          Compare plans — upgrade or downgrade as your advocate programs mature.
        </p>
        <ul className="mt-14 grid list-none gap-8 p-0 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <li key={tier.name}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-gold/60 bg-gradient-to-b from-gold/10 to-white/5 shadow-[0_0_40px_rgba(212,168,67,0.12)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-gold">
                  {tier.name}
                </p>
                <p className="mt-3 font-heading text-4xl font-bold text-offwhite">
                  {tier.price}
                </p>
                <p className="mt-2 text-sm text-white/55">{tier.blurb}</p>
                <ul className="mt-8 flex-1 list-disc space-y-2 pl-5 text-sm text-white/70">
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <WaitlistForm
        heading={`Partner with Sif's Gold early.`}
        id="waitlist"
      />
    </div>
  );
}
