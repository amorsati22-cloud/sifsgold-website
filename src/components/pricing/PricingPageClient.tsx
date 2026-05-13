"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pricingTiers, type PricingBucket } from "@/data/pricing";
import { PRICING_FAQS } from "@/data/pricing-faqs";
import { TierCard } from "@/components/pricing/TierCard";

type BillingMode = "monthly" | "annual";

const bucketOrder: PricingBucket[] = [
  "beautyAndGroomingPros",
  "salonsAndStudios",
  "fashionIndustry",
  "clientsAndBrands",
];

const bucketMeta: Record<PricingBucket, { title: string; subtitle: string; background: string }> = {
  beautyAndGroomingPros: {
    title: "Beauty & Grooming Pros",
    subtitle: "Built for independent professionals, students, and schools training the next generation.",
    background: "bg-navy",
  },
  salonsAndStudios: {
    title: "Salons & Studios",
    subtitle: "Team plans for high-volume appointment businesses and operational leaders.",
    background: "bg-navy-light/30",
  },
  fashionIndustry: {
    title: "Fashion Industry",
    subtitle: "Beta pricing for talent, agencies, directors, showrooms, designers, and producers.",
    background: "bg-navy",
  },
  clientsAndBrands: {
    title: "Clients & Brands",
    subtitle: "Plans for discovery, booking convenience, storefront growth, and Gold Partners programs.",
    background: "bg-navy-light/30",
  },
};

function getGridClass(count: number) {
  if (count <= 2) return "grid-cols-1 md:grid-cols-2";
  if (count <= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function PricingPageClient() {
  const [billing, setBilling] = useState<BillingMode>("annual");
  const [openFaq, setOpenFaq] = useState<string | null>(PRICING_FAQS[0]?.id ?? null);

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy text-cream">
      <section className="border-b border-gold/15 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl text-cream md:text-6xl">Pay for what fits.</h1>
          <p className="mt-5 max-w-3xl text-lg text-cream/80">
            Every plan includes the full feature library, with new features released weekly
            post-launch.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <div className="inline-flex rounded-full border border-gold/40 bg-navy-deep p-1" role="radiogroup" aria-label="Billing period">
              <button
                type="button"
                role="radio"
                aria-checked={billing === "monthly"}
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-brand-fast ${
                  billing === "monthly" ? "bg-gold text-navy" : "text-cream/80 hover:text-cream"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={billing === "annual"}
                onClick={() => setBilling("annual")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-brand-fast ${
                  billing === "annual" ? "bg-gold text-navy" : "text-cream/80 hover:text-cream"
                }`}
              >
                Annual
              </button>
            </div>
            <span className="rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-semibold text-cream">
              Save 17-22%
            </span>
          </div>
        </div>
      </section>

      {bucketOrder.map((key) => {
        const bucket = bucketMeta[key];
        const tiers = pricingTiers[key];
        return (
          <section key={key} className={`border-b border-gold/10 py-14 md:py-20 ${bucket.background}`}>
            <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
              <h2 className="font-heading text-3xl text-cream md:text-4xl">{bucket.title}</h2>
              <p className="mt-3 max-w-3xl text-cream/80">{bucket.subtitle}</p>
              <div className={`mt-8 grid gap-5 ${getGridClass(tiers.length)}`}>
                {tiers.map((tier) => (
                  <TierCard key={tier.id} tier={tier} billing={billing} showBetaBadge={key === "fashionIndustry"} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-b border-gold/10 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-8 rounded-brand-lg border border-gold/25 bg-navy-deep/70">
            {PRICING_FAQS.map((item) => {
              const open = openFaq === item.id;
              return (
                <div key={item.id} className="border-b border-gold/10 last:border-b-0">
                  <button
                    type="button"
                    id={`faq-trigger-${item.id}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenFaq(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-cream transition duration-brand-fast hover:bg-white/[0.03]"
                  >
                    <span className="font-semibold">{item.question}</span>
                    <ChevronDown className={`h-5 w-5 text-gold transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    hidden={!open}
                    className="px-5 pb-4"
                  >
                    <p className="text-sm text-cream/80">{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy-light/30 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="rounded-brand-lg border border-gold/30 bg-navy-deep/75 p-8 text-center">
            <h2 className="font-heading text-3xl text-cream md:text-4xl">Still deciding? Talk to us.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-cream/80">
              Start with the tier that fits today and move at your pace as your business grows.
            </p>
            <button
              type="button"
              className="group mt-6 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
            >
              <span className="group-hover:animate-gold-shimmer">Talk to us</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

