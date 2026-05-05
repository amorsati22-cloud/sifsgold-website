import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";

export const metadata: Metadata = {
  title: "For Licensed Professionals | Sif's Gold",
  description:
    "Booking, client records, income tracking, and a community built for licensed beauty professionals.",
};

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
      {children}
    </span>
  );
}

export default function ForProfessionalsPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <SectionBadge>For Licensed Professionals</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Run your beauty business like you built it.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Booking, client records, income tracking, and a community built for
            licensed professionals. Not corporate salon software — a platform
            built for you.
          </p>
          <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
            <Link
              href="#waitlist"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gold px-8 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:w-auto"
            >
              Start Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-transparent px-8 text-sm font-semibold text-offwhite transition hover:border-gold/60 hover:bg-white/5 md:w-auto"
            >
              See the Pricing
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-navy-light/20 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "97%", label: "Revenue kept on web bookings" },
            { stat: "4 Modes", label: "Book Status system" },
            { stat: "Gold Standard Score", label: "Your reputation metric" },
            { stat: "Green Sheet", label: "Built-in income tracker" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6"
            >
              <p className="text-2xl font-semibold tracking-tight text-gold">
                {item.stat}
              </p>
              <p className="mt-2 text-sm leading-snug text-white/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "The Reign Calendar",
                body: "Smart booking with processing time logic, Flash Deals, and waitlist management.",
              },
              {
                title: "Green Sheet",
                body: "Track every dollar. Gross income, platform fees, product costs, and real net profit in one view.",
              },
              {
                title: "The Vault",
                body: "Biometric-locked encrypted formula records for every client you've ever served.",
              },
              {
                title: "Client Records",
                body: "Full booking history, intake forms, style notes, before and afters, and rebooking windows.",
              },
              {
                title: "Gold Standard Score",
                body: "A reputation score built from your actual booking behavior, not just star ratings.",
              },
              {
                title: "Gold TV",
                body: "Share your work with the community and build your professional presence in the industry.",
              },
            ].map((card) => (
              <li
                key={card.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-navy-light/30 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-offwhite">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionBadge>For barbers specifically</SectionBadge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            The Fade — built for barbershops.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
            The Fade is Sif&apos;s Gold&apos;s barbershop dashboard. Walk-in
            queue management, Chair Fill Rate analytics, and a community board
            built for the barbering industry. Not a salon product adapted for
            barbers — built for barbers from the start.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-navy-dark/50 p-8">
              <h3 className="text-xl font-semibold text-offwhite">
                Walk-In Queue
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Keep the shop moving. Manage walk-ins alongside appointments so
                no chair sits empty and no client waits blind.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-dark/50 p-8">
              <h3 className="text-xl font-semibold text-offwhite">
                Chair Fill Rate
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                See how full your day really was — not just bookings on a
                calendar, but utilization you can act on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="text-lg font-medium text-offwhite sm:text-xl">
            From free to $24.99/month. Built to grow with your business.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
          >
            View pricing
          </Link>
        </div>
      </section>

      <WaitlistForm heading="Join professionals already on the waitlist." />
    </div>
  );
}
