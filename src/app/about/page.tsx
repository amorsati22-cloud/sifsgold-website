import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { WheatBranch } from "@/components/decorative/WheatBranch";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why the Sif's Gold team is building one platform for beauty, grooming, fitness, and fashion.",
};

const VALUES = [
  {
    title: "Privacy first",
    body: "We don't sell your data. We never will. Sensitive health and financial information is encrypted on your device, not on our servers.",
    icon: Lock,
  },
  {
    title: "Both, equally",
    body: "Masculine and feminine experiences are first-class. Barbershops, men's grooming, and men's wellness aren't an afterthought.",
    icon: Sparkles,
  },
  {
    title: "State-accurate",
    body: "Board prep that uses your state's exact vendor, exact hours, exact passing score, exact statute citation. Not generic content.",
    icon: BadgeCheck,
  },
  {
    title: "Built for everyone in beauty",
    body: "Stylists, barbers, estheticians, nail techs, lash artists, tattoo artists, models, casting directors - every craft, one platform.",
    icon: ShieldCheck,
  },
  {
    title: "Compliance is the floor",
    body: "HIPAA, FTC §255, CCPA, state-specific scope of practice. We treat regulations as the starting point, not the ceiling.",
    icon: Scale,
  },
  {
    title: "Money flows where work happens",
    body: "Subscriptions on the web at ~97% retention. Stripe for service payments. Apple/Google only where required for consumables.",
    icon: Wallet,
  },
] as const;

export default function AboutPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <header className="relative overflow-hidden border-b border-gold/10 bg-navy py-16 md:py-24">
        <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 md:grid-cols-[1fr_220px] md:px-8">
          <div>
            <h1 className="max-w-4xl font-heading text-[40px] text-gold md:text-[56px]">
              Built for everyone in beauty.
            </h1>
            <p className="mt-5 max-w-3xl text-xl text-cream/80">
              Beauty, grooming, fitness, and fashion - one platform that respects every craft.
            </p>
          </div>
          <div className="relative hidden items-center justify-center md:flex">
            <GoddessProfile className="h-44 w-44 text-gold/35" />
            <WheatBranch className="absolute -bottom-2 right-0 h-12 w-24 text-gold/45" />
          </div>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Why we built this</h2>
          <div className="mt-6 max-w-4xl space-y-5 text-base leading-relaxed text-cream/85">
            <p>
              We built this because professionals across beauty keep juggling six different tools:
              one for bookings, one for taxes, one for inventory, one for studying boards, one for
              connecting with brands, and one for clients to find them.
            </p>
            <p>
              We kept seeing the same truth across every corner of this industry: beauty, grooming,
              fitness, and fashion share the same professionals, the same clients, and the same
              operational pain - but no single platform serves them as one connected ecosystem.
            </p>
            <p>
              Our commitment is to build a platform that does not extract from creators - one that
              respects state laws, protects minors, refuses to sell data, and treats both feminine
              and masculine clients as equally first-class.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">What we stand for</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6"
                >
                  <div className="mb-4 inline-flex rounded-full border border-gold/45 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-heading text-2xl text-gold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{value.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">What we&apos;re building</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h3 className="font-heading text-2xl text-gold">For professionals</h3>
              <ul className="mt-4 space-y-2 text-sm text-cream/85">
                <li>Unified booking, client management, and payment routing</li>
                <li>Education and compliance tools tied to real state requirements</li>
                <li>Portfolio, media, and growth workflows in one account</li>
                <li>Transparent revenue model that keeps creators in control</li>
              </ul>
            </article>
            <article className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h3 className="font-heading text-2xl text-gold">For students</h3>
              <ul className="mt-4 space-y-2 text-sm text-cream/85">
                <li>State-accurate board prep and study progression tracking</li>
                <li>Hour logging and licensure readiness checkpoints</li>
                <li>Mentor and apprenticeship visibility within the platform</li>
                <li>Clear bridge from student status to active professional profile</li>
              </ul>
            </article>
            <article className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h3 className="font-heading text-2xl text-gold">For clients</h3>
              <ul className="mt-4 space-y-2 text-sm text-cream/85">
                <li>Smarter discovery across beauty, grooming, and wellness providers</li>
                <li>Confident booking with clear service details and trust signals</li>
                <li>Consistent communication and booking history visibility</li>
                <li>Experience that respects individual style and identity needs</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Where we are</h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-cream/85">
            Sif&apos;s Gold is launching in 2026. We&apos;re built in Minnesota and serving every U.S.
            state. Fashion industry expansion follows shortly after launch.
          </p>
          <div className="mt-8 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Backed by / Partners
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`partner-${i}`}
                  className="flex h-14 items-center justify-center rounded-brand-md border border-cream/20 bg-navy text-xs text-cream/60"
                >
                  Logo {i + 1}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-cream/65">
              Partner logos appear here at launch.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Join the platform</h2>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/#waitlist"
              className="group inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
            >
              <span className="group-hover:animate-gold-shimmer">Join the waitlist</span>
            </Link>
            <Link
              href="/pricing"
              className="group inline-flex items-center justify-center rounded-full border border-teal px-6 py-3 text-sm font-semibold text-teal transition-all duration-brand-fast hover:bg-teal/10"
            >
              See pricing
            </Link>
            <Link
              href="#"
              className="group inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10"
            >
              Become a Sif&apos;s Advocate
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
