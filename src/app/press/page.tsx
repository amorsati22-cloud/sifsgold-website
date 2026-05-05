import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PressInquiryForm } from "@/components/marketing/PressInquiryForm";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

export const metadata: Metadata = {
  title: "Press and Media | Sif's Gold",
  description:
    "Company facts, media assets, and press inquiries for Sif's Gold — the all-in-one beauty and fashion platform.",
};

const ASSETS = [
  { title: "Sif's Gold Logo (PNG, SVG)" },
  { title: "App Screenshots" },
  { title: "Press Kit (PDF)" },
] as const;

const FACTS = [
  { label: "Founded", value: "2026" },
  { label: "Headquarters", value: "Minneapolis, Minnesota" },
  { label: "Industries", value: "Beauty and fashion" },
  { label: "Launch date", value: "June 1, 2026" },
  { label: "Fashion expansion", value: "June 30, 2026" },
] as const;

export default function PressPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Press and Media
          </h1>
        </div>
      </header>

      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-pretty text-lg leading-relaxed text-white/70">
            Sif&apos;s Gold is an all-in-one beauty and fashion platform serving students, licensed
            professionals, schools, salons, clients, storefronts, brand partners, and fashion
            industry talent.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Key facts</h2>
          <dl className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {f.label}
                </dt>
                <dd className="mt-2 text-lg font-medium text-offwhite">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Assets</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            Downloadable brand and product materials. Files will be available at launch.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ASSETS.map((a) => (
              <li
                key={a.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-navy-light/30 p-6"
              >
                <div className="inline-flex rounded-full bg-gold/15 p-3 text-gold">
                  <Download className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-offwhite">{a.title}</h3>
                <p className="mt-2 text-sm font-medium text-gold/90">Coming at launch</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gradient-to-b from-navy-light/20 to-navy py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Press inquiries</h2>
          <p className="mt-3 text-white/70">
            For press inquiries, use the contact form below.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-navy-dark/50 p-6 sm:p-8">
            <PressInquiryForm accessKey={web3formsWaitlistAccessKey} />
          </div>
        </div>
      </section>
    </div>
  );
}
