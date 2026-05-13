import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarClock,
  Clapperboard,
  Link2,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sif's Advocate Program",
  description:
    "Earn through five revenue streams tied to real platform revenue — brand deals, referrals, affiliates, originals, and subscriptions.",
  alternates: { canonical: `${BRAND.url}/advocates` },
};

const REVENUE_STREAMS = [
  {
    title: "Brand Deal Marketplace",
    body: "Sponsored placements and packages negotiated inside Sif's Gold — 70% to the creator, 30% to the platform.",
    icon: ShoppingBag,
  },
  {
    title: "Booking Referral Commissions",
    body: "When your audience books through your tracked links, you earn between 3% and 10% on qualifying completed appointments.",
    icon: CalendarClock,
  },
  {
    title: "Product Affiliate Commissions",
    body: "Curated retail and partner SKUs ship with transparent attribution — typically 5% to 20% depending on the brand agreement.",
    icon: Link2,
  },
  {
    title: "Originals Commissions",
    body: "Selective long-form and series work can be commissioned upfront when it aligns with platform programming and brand safety.",
    icon: Clapperboard,
  },
  {
    title: "Subscriptions & Tips",
    body: "Fan-supported income on profiles you own — 85% to the creator after payment processing and platform infrastructure.",
    icon: Wallet,
  },
] as const;

const TIERS = ["Newcomer", "Rising", "Sif's Advocate", "Gold Partner", "Founding Gold"] as const;

export default function AdvocatesLandingPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Advocates", href: "/advocates" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold/90">Sif&apos;s Advocate Program</p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-black leading-tight text-gold md:text-5xl lg:text-6xl">
            Sif&apos;s Advocates. Real industry. Real money.
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Sif&apos;s Advocates earn through five revenue streams — all tied to revenue Sif&apos;s Gold earned first, never
            view-based. When the platform wins, your upside is tied to receipts clients already paid — not vanity metrics.
          </p>
          <div className="mt-10">
            <Link
              href="/advocates/apply"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-base font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Apply now
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Five revenue streams</h2>
          <p className="mt-4 max-w-3xl text-cream/80">
            Every stream is designed around completed transactions, cleared payouts, or contracted work — not empty impressions.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {REVENUE_STREAMS.map((stream) => {
              const Icon = stream.icon;
              return (
                <article
                  key={stream.title}
                  className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 md:p-8"
                >
                  <div className="mb-4 inline-flex rounded-full border border-gold/45 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-heading text-xl text-gold">{stream.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{stream.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Tier progression</h2>
          <p className="mt-4 max-w-3xl text-cream/85">
            Show up consistently, keep trust high, and grow verified outcomes — your tier unlocks higher splits, earlier
            deal flow, and partner-only rooms.
          </p>
          <ol className="mt-10 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2">
            {TIERS.map((tier, i) => (
              <li key={tier} className="contents">
                {i > 0 ? (
                  <ArrowRight
                    className="hidden h-5 w-5 shrink-0 text-gold/45 md:block"
                    aria-hidden
                  />
                ) : null}
                <span className="inline-flex items-center gap-3 rounded-full border border-gold/35 bg-navy-deep/80 px-4 py-2.5 md:inline-flex">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <span className="font-heading text-base text-cream">{tier}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-brand-lg border border-gold/35 bg-gold/10 p-6 md:flex md:items-start md:gap-4">
            <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-gold" aria-hidden />
            <div>
              <h3 className="font-heading text-xl text-gold">Founding Gold</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/90">
                The first 100 Sif&apos;s Advocates get a <strong className="text-gold">1.25× earnings multiplier</strong> for
                12 months on eligible platform-tracked payouts — applied after you qualify and accept the Founding Gold
                agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Eligibility</h2>
          <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-cream/88">
            <li>
              <strong className="text-gold">Licensed pros earn 2×</strong> on qualifying referral and booking streams when
              your license is verified in-app — no follower minimum required to start.
            </li>
            <li>Creators without a trade license can still earn on brand, affiliate, originals, and fan-supported streams.</li>
            <li>All payouts stay subject to tax reporting, chargeback windows, and the advocate agreement at launch.</li>
          </ul>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-deep/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <BadgePercent className="h-4 w-4" aria-hidden />
            Month 3
          </div>
          <h2 className="mt-6 font-heading text-3xl text-gold md:text-4xl">Launching Month 3 post-platform-launch</h2>
          <p className="mx-auto mt-4 max-w-2xl text-cream/85">
            Applications open now for Founding Gold consideration. We review in batches so the first cohort lands with real
            tooling — not a PDF and a prayer.
          </p>
          <Link
            href="/advocates/apply"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold bg-gold/15 px-8 py-3 text-base font-semibold text-gold transition hover:bg-gold hover:text-navy"
          >
            Apply for Founding Gold
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </article>
  );
}
