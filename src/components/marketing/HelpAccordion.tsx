"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I get started?",
    a: "Download the Sif’s Gold app, create an account, and select your user type. The onboarding flow guides you through setup.",
  },
  {
    q: "How do I change my subscription?",
    a: "Go to Settings → My Plan in the app. Changes take effect at the next billing date.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your Vault, client records, and formula data are encrypted and visible only to you.",
  },
  {
    q: "How do I report a problem?",
    a: "Use the Get Help button inside the app, or submit through the form on this page.",
  },
  {
    q: "When does the app launch?",
    a: "June 1, 2026. Join the waitlist at the top of this page for early access.",
  },
];

export function HelpAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-navy-dark/50">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="px-1">
            <button
              type="button"
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-body text-offwhite transition hover:bg-white/[0.03] sm:px-6"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-semibold">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div className="border-t border-white/5 px-5 pb-4 pt-0 sm:px-6">
                <p className="pt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
