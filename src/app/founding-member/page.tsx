import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FoundingMemberWaitlistForm } from "@/components/founding/FoundingMemberWaitlistForm";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Founding Member Program | Sif's Gold",
  description:
    "Founding Members get time-bound perks for their first year on Sif's Gold — badge, pricing, trials, boosts, and early access.",
  alternates: { canonical: `${BRAND.url}/founding-member` },
};

const PERKS = [
  {
    title: '"Founding Member 2026" badge',
    body: "Visible on your profile for 12 months after you activate. Optional $19 permanent keepsake add-on at launch.",
  },
  {
    title: "20% off first-year annual pricing",
    body: "Applies to eligible annual plans you purchase during the founding window — details in checkout at launch.",
  },
  {
    title: "30 days free on Pro and Premium",
    body: "Stacked according to launch billing rules; converts to standard pricing unless you cancel before the trial ends.",
  },
  {
    title: "1.25× creator earnings boost",
    body: "For 12 months when you also join and qualify for the Sif's Advocate Program — tied to eligible tracked payouts.",
  },
  {
    title: "Founding-only Sif's Sounds Studio audio",
    body: "Exclusive drops and stems for launch campaigns — licensed for on-platform use under the founding terms.",
  },
  {
    title: "Early access",
    body: "Roughly one to two weeks before the public App Store listing — same builds, fewer rough edges.",
  },
  {
    title: "Direct line to the team",
    body: "Priority inbox and office hours for the first 60 days after you activate a paid founding plan.",
  },
] as const;

export default function FoundingMemberPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Founding Member", href: "/founding-member" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="max-w-4xl font-heading text-4xl font-black leading-tight text-gold md:text-5xl lg:text-6xl">
            Be one of the first.
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-xl leading-relaxed text-cream/90">
            Founding Members get meaningful perks that are intentionally time-bound: real savings, real access, and real upside
            for your first year on Sif&apos;s Gold — without promising vague &quot;lifetime&quot; language we can&apos;t keep.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Founding perks (revised — time-bound)</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PERKS.map((perk) => (
              <article key={perk.title} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
                <h3 className="font-heading text-lg text-gold">{perk.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/85">{perk.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Window</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream/88">
            Founding Membership opens at launch and closes <strong className="text-gold">90 days after</strong> the public
            opening. Waitlist members get first notice and the cleanest path to checkout.
          </p>
        </div>
      </section>

      <section className="bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-navy-dark/70 p-8 shadow-xl backdrop-blur-md sm:p-10">
            <h2 className="text-center font-heading text-2xl text-gold">Join the founding list</h2>
            <p className="mt-3 text-center text-sm text-white/65">
              We&apos;ll only use this to send launch updates and founding offers — no spam, no resale.
            </p>
            <div className="mt-8">
              <FoundingMemberWaitlistForm idPrefix="founding" />
            </div>
            <p className="mt-8 text-center text-sm text-white/55">
              Prefer the general waitlist?{" "}
              <Link href="/#waitlist" className="font-semibold text-gold underline-offset-4 hover:underline">
                Sif&apos;s Circle
              </Link>
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
