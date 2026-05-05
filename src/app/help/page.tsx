import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CreditCard,
  Search,
  Shield,
  Sparkles,
  UsersRound,
  Wallet,
} from "lucide-react";
import { HelpAccordion } from "@/components/marketing/HelpAccordion";
import { HelpContactForm } from "@/components/marketing/HelpContactForm";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

export const metadata: Metadata = {
  title: "Help Center | Sif's Gold",
  description:
    "Getting started, billing, bookings, payouts, privacy, and community guidelines for Sif's Gold.",
};

const TOPICS: { title: string; icon: LucideIcon }[] = [
  { title: "Getting Started", icon: Sparkles },
  { title: "Account and Billing", icon: CreditCard },
  { title: "Booking and Calendar", icon: CalendarDays },
  { title: "Payments and Payouts", icon: Wallet },
  { title: "Privacy and Security", icon: Shield },
  { title: "Community and Guidelines", icon: UsersRound },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Help Center
          </h1>
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-gold/30 bg-navy-dark/60 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/80 sm:text-base">
              <span className="font-semibold text-offwhite">Early access:</span> join the waitlist
              for launch updates.
            </p>
            <Link
              href="/#waitlist"
              className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-gold px-6 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:w-auto"
            >
              Join waitlist
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <label htmlFor="help-search" className="sr-only">
            Search for help
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/80"
              aria-hidden
            />
            <input
              id="help-search"
              type="search"
              name="q"
              placeholder="Search for help..."
              className="w-full rounded-2xl border border-white/20 bg-navy-dark/60 py-3.5 pl-12 pr-4 text-offwhite outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse topics
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map(({ title, icon: Icon }) => (
              <li key={title}>
                <Link
                  href="#"
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-navy-light/30 p-6 transition hover:border-gold/40 hover:bg-navy-light/50"
                >
                  <span className="inline-flex rounded-full bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  </span>
                  <span className="font-semibold text-offwhite">{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Quick answers</h2>
          <div className="mt-8">
            <HelpAccordion />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Still need help?</h2>
          <p className="mt-3 text-white/70">
            Send us a message and we&apos;ll get back to you as soon as we can.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-navy-dark/50 p-6 sm:p-8">
            <HelpContactForm accessKey={web3formsWaitlistAccessKey} />
          </div>
        </div>
      </section>
    </div>
  );
}
