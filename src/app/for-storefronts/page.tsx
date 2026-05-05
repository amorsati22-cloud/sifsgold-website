import type { Metadata } from "next";
import { Boxes, Package, Sparkles, Store } from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { StatCard } from "@/components/ui/StatCard";

export const metadata: Metadata = {
  title: "For Beauty Supply Storefronts | Sif's Gold",
  description:
    "Your products, discoverable by licensed professionals actively shopping for supplies — no middleman, no guesswork.",
};

const BASIC_FEATURES = [
  "Scout storefront profile & category placement",
  "Core catalog sync and stock visibility",
  "Order and fulfillment basics in one view",
  "Standard email support",
];

const PLUS_FEATURES = [
  "Everything in Basic",
  "Pro Picks priority placement & curated bundles",
  "Advanced inventory rules, alerts, and velocity reports",
  "Unlimited Bundle Builder with featured merchandising slots",
  "Priority chat support",
];

export default function ForStorefrontsPage() {
  return (
    <div className="bg-navy">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>For Beauty Supply Storefronts</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Reach verified beauty professionals directly.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Your products, discoverable by licensed professionals actively
            shopping for supplies. No middleman, no guesswork — professionals
            find the right product for the service they&apos;re booking.
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
              icon={<Store className="h-6 w-6" aria-hidden />}
              title="Scout Storefront Presence"
              description="Show up where pros search by category, service adjacency, and verified licensure — not buried in generic marketplaces."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" aria-hidden />}
              title="Pro Picks Matchmaker"
              description="Surface the right SKU to the right professional based on what they book, buy, and restock most often."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Package className="h-6 w-6" aria-hidden />}
              title="Inventory Management"
              description="Keep availability honest across channels so pros never ghost a client over an out-of-stock tube you still showed as live."
            />
          </li>
          <li>
            <FeatureCard
              icon={<Boxes className="h-6 w-6" aria-hidden />}
              title="Bundle Builder"
              description="Merchandise kits pros actually need for services — sell bundles that match how chairs run, not random leftovers."
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Revenue model
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
          8% commission on platform-facilitated sales. Zero listing fees.
          Products visible immediately to professionals in your category.
        </p>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <StatCard
              number="$19.99/mo"
              label="Basic"
              sublabel="Launch-ready storefront tools on Scout."
            />
            <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-white/65">
              {BASIC_FEATURES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-white/5 p-8">
            <StatCard
              number="$49.99/mo"
              label="Plus"
              sublabel="Growth merchandising for high-volume storefronts."
            />
            <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-white/65">
              {PLUS_FEATURES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <WaitlistForm heading="Join the storefront waitlist." id="waitlist" />
    </div>
  );
}
