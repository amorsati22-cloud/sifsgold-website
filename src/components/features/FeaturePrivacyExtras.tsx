"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/sections/SectionReveal";

const ROWS = [
  {
    label: "Profile & booking basics",
    body: "Name, contact preferences, and appointment history needed to run the calendar.",
    defaultOn: true,
  },
  {
    label: "Health Hub (optional vault)",
    body: "Pulse, medications, and cycle fields — Tier A zero-knowledge encryption, off by default.",
    defaultOn: false,
  },
  {
    label: "Commerce & payouts",
    body: "Receipts, tax summaries, and Stripe identifiers required to move money compliantly.",
    defaultOn: true,
  },
  {
    label: "Messages & education threads",
    body: "In-app conversations and study groups — retention windows published in the privacy center.",
    defaultOn: true,
  },
  {
    label: "Photo & media releases",
    body: "Consent-scoped galleries with expirations — never merged into ads profiles.",
    defaultOn: false,
  },
] as const;

export function FeaturePrivacyExtras() {
  return (
    <section className="border-b border-gold/10 bg-navy py-16 md:py-20" aria-labelledby="privacy-data-map-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 id="privacy-data-map-heading" className="font-heading text-3xl text-gold md:text-4xl">
            Data categories & consent (illustration)
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-cream/80">
            These toggles are an educational preview of how consent surfaces are grouped — final controls ship with launch
            QA. Nothing here changes your live account yet.
          </p>
          <ul className="mt-10 space-y-4" role="list">
            {ROWS.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-3 rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="max-w-2xl">
                  <p className="font-heading text-lg text-cream">{row.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{row.body}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold-body">Preview</span>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    aria-pressed={row.defaultOn}
                    title="Illustration only — not connected to your account"
                    className={`relative h-8 w-14 rounded-full border border-gold/40 transition ${
                      row.defaultOn ? "bg-teal/30" : "bg-navy-deep"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-7 w-7 rounded-full border border-gold/50 bg-cream transition-transform ${
                        row.defaultOn ? "left-7" : "left-0.5"
                      }`}
                      aria-hidden
                    />
                    <span className="sr-only">{row.defaultOn ? "On (illustration)" : "Off (illustration)"}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-cream/80">
            Read the full policy any time:{" "}
            <Link href="/legal/privacy" className="font-semibold text-gold underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
