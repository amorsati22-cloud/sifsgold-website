"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FeatureFaqItem } from "@/types/feature-deep-dive";

export function FeatureFAQ({ faqs, idPrefix }: { faqs: FeatureFaqItem[]; idPrefix: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-gold/10 bg-navy py-16 md:py-20" aria-labelledby={`${idPrefix}-faq-heading`}>
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id={`${idPrefix}-faq-heading`} className="font-heading text-3xl text-gold md:text-4xl">
          Questions
        </h2>
        <div className="mt-8 rounded-brand-lg border border-gold/25 bg-navy-deep/70">
          {faqs.map((item, index) => {
            const panelId = `${idPrefix}-faq-panel-${index}`;
            const triggerId = `${idPrefix}-faq-trigger-${index}`;
            const open = openIndex === index;
            return (
              <div key={triggerId} className="border-b border-gold/10 last:border-b-0">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-body text-cream transition duration-brand-fast hover:bg-white/[0.03]"
                  >
                    <span className="font-semibold">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                  className="px-5 pb-4"
                >
                  <p className="text-sm leading-relaxed text-cream/80">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
