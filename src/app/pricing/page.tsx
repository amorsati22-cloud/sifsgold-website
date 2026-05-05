"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { GoldButton } from "@/components/ui/GoldButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

type BillingPeriod = "monthly" | "yearly";

type PlanRow = {
  name: string;
  monthly: number;
  /** When null, yearly = monthly * 12 * 0.8 (20% off annualized) */
  yearly: number | null;
  features: string[];
};

type PlanGroup = {
  id: string;
  title: string;
  footnote?: string;
  plans: PlanRow[];
};

function fmt(n: number) {
  const abs = Math.abs(n);
  const digits = abs >= 100 && abs % 1 === 0 ? 0 : 2;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function displayPrice(
  plan: PlanRow,
  billing: BillingPeriod,
): { main: string; suffix: string } {
  if (plan.monthly === 0) {
    return { main: fmt(0), suffix: "" };
  }
  if (billing === "monthly") {
    return { main: fmt(plan.monthly), suffix: "/mo" };
  }
  const y =
    plan.yearly !== null ? plan.yearly : Math.round(plan.monthly * 12 * 0.8 * 100) / 100;
  return { main: fmt(y), suffix: "/yr" };
}

const BEAUTY_GROUPS: PlanGroup[] = [
  {
    id: "student",
    title: "Student plans",
    plans: [
      {
        name: "Free",
        monthly: 0,
        yearly: 0,
        features: [
          "Board Prep (5 states)",
          "Clock In",
          "The Studio community",
          "3 study games",
        ],
      },
      {
        name: "Pro",
        monthly: 9.99,
        yearly: 89.99,
        features: [
          "All 50 states",
          "All 8 games",
          "Mentor Match",
          "The Bridge",
        ],
      },
      {
        name: "Master",
        monthly: 14.99,
        yearly: 139.99,
        features: [
          "Everything in Pro",
          "AI Board Coach",
          "Priority board support",
        ],
      },
    ],
  },
  {
    id: "professional",
    title: "Professional plans",
    plans: [
      {
        name: "Free",
        monthly: 0,
        yearly: 0,
        features: ["Profile", "10 bookings/mo", "basic Green Sheet"],
      },
      {
        name: "Base",
        monthly: 14.99,
        yearly: 149.99,
        features: [
          "Unlimited bookings",
          "Full Green Sheet",
          "Vault",
          "Flash Deals",
        ],
      },
      {
        name: "Elite",
        monthly: 24.99,
        yearly: 249.99,
        features: [
          "Everything in Base",
          "Gold TV",
          "Advanced analytics",
          "Priority support",
        ],
      },
    ],
  },
  {
    id: "client",
    title: "Client plans",
    plans: [
      {
        name: "Free",
        monthly: 0,
        yearly: 0,
        features: ["Browse Scout", "Book appointments", "Style DNA"],
      },
      {
        name: "Pro",
        monthly: 6.99,
        yearly: 59.99,
        features: [
          "Mood Booking",
          "Beauty Clock",
          "Priority booking",
          "Sif's Invitation credits",
        ],
      },
    ],
  },
  {
    id: "school",
    title: "School plans",
    plans: [
      {
        name: "Free",
        monthly: 0,
        yearly: 0,
        features: ["Up to 10 students"],
      },
      {
        name: "Standard",
        monthly: 99,
        yearly: 990,
        features: [
          "Up to 100 students",
          "Clinic Manager",
          "Board analytics",
        ],
      },
      {
        name: "Partner",
        monthly: 199,
        yearly: 1990,
        features: [
          "Unlimited students",
          "All features",
          "Hall of Gold",
        ],
      },
    ],
  },
  {
    id: "salon",
    title: "Salon / barbershop plans",
    plans: [
      {
        name: "Free",
        monthly: 0,
        yearly: 0,
        features: ["1 staff member", "Basic booking"],
      },
      {
        name: "Pro",
        monthly: 49.99,
        yearly: 499.99,
        features: [
          "Up to 10 staff",
          "The Floor / The Fade",
          "Staff scheduling",
        ],
      },
      {
        name: "Partner",
        monthly: 99.99,
        yearly: 999.99,
        features: [
          "Unlimited staff",
          "Multi-location (up to 5)",
          "Advanced analytics",
        ],
      },
    ],
  },
  {
    id: "storefront",
    title: "Storefront plans",
    plans: [
      {
        name: "Basic",
        monthly: 19.99,
        yearly: null,
        features: ["Up to 50 products", "Scout presence"],
      },
      {
        name: "Plus",
        monthly: 49.99,
        yearly: null,
        features: [
          "Unlimited products",
          "Pro Picks",
          "Bundle Builder",
          "Analytics",
        ],
      },
    ],
  },
  {
    id: "brand",
    title: "Brand partner plans",
    plans: [
      {
        name: "Starter",
        monthly: 149,
        yearly: null,
        features: ["Campaign briefs", "Up to 5 ambassadors"],
      },
      {
        name: "Campaign",
        monthly: 299,
        yearly: null,
        features: [
          "20 ambassadors",
          "Content approval workflow",
          "Analytics",
        ],
      },
      {
        name: "Premier",
        monthly: 599,
        yearly: null,
        features: [
          "Unlimited ambassadors",
          "Brand Intelligence Briefing",
          "Dedicated support",
        ],
      },
    ],
  },
];

const FASHION_GROUPS: PlanGroup[] = [
  {
    id: "model",
    title: "Model",
    plans: [
      { name: "Free", monthly: 0, yearly: 0, features: ["Core profile & Scout visibility"] },
      { name: "Essential", monthly: 12.99, yearly: null, features: ["Bookings & comp tools"] },
      { name: "Pro", monthly: 24.99, yearly: null, features: ["Full runway toolkit"] },
      { name: "Student", monthly: 9.99, yearly: null, features: ["Student-priced essentials"] },
    ],
  },
  {
    id: "agency",
    title: "Agency",
    plans: [
      { name: "Starter", monthly: 99, yearly: null, features: ["Small roster"] },
      { name: "Standard", monthly: 199, yearly: null, features: ["Growing agency"] },
      { name: "Enterprise", monthly: 399, yearly: null, features: ["Full operations"] },
    ],
  },
  {
    id: "casting",
    title: "Casting director",
    plans: [
      { name: "Essential", monthly: 49, yearly: null, features: ["Calls & shortlists"] },
      { name: "Pro", monthly: 99, yearly: null, features: ["Advanced casting"] },
    ],
  },
  {
    id: "designer",
    title: "Fashion designer",
    plans: [
      { name: "Student", monthly: 9.99, yearly: null, features: ["Student studio"] },
      { name: "Starter", monthly: 29.99, yearly: null, features: ["Launch runway"] },
      { name: "Pro", monthly: 59.99, yearly: null, features: ["Full atelier"] },
    ],
  },
  {
    id: "clothing-brand",
    title: "Clothing brand",
    plans: [
      { name: "Standard", monthly: 199, yearly: null, features: ["Brand shelf & buyers"] },
      { name: "Premier", monthly: 499, yearly: null, features: ["Premier placement"] },
    ],
  },
  {
    id: "stylist",
    title: "Fashion stylist",
    plans: [
      { name: "Essential", monthly: 19.99, yearly: null, features: ["Pulls & day rates"] },
      { name: "Pro", monthly: 39.99, yearly: null, features: ["Full kit"] },
    ],
  },
  {
    id: "showroom",
    title: "Showroom",
    footnote: "Enterprise includes 3% commission on platform-facilitated showroom sales.",
    plans: [
      { name: "Starter", monthly: 99, yearly: null, features: ["Single floor"] },
      { name: "Standard", monthly: 199, yearly: null, features: ["Multi-buyer"] },
      { name: "Enterprise", monthly: 399, yearly: null, features: ["Full showroom ops"] },
    ],
  },
  {
    id: "producer",
    title: "Fashion event producer",
    plans: [
      { name: "Standard", monthly: 149, yearly: null, features: ["Single-show ops"] },
      { name: "Pro", monthly: 299, yearly: null, features: ["Touring & multi-show"] },
    ],
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Is there really a free tier?",
    a: "Yes, every user type has a free tier.",
  },
  {
    q: "Why are subscriptions on the website instead of in the app?",
    a: "Subscribing through the website means you keep more of your revenue. App store fees reduce what you actually earn.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes, upgrade or downgrade at any time.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is retained for 90 days after cancellation. You can export everything before you go.",
  },
  {
    q: "Is there a student-to-professional discount?",
    a: "Yes. The Bridge discount gives graduating students 3 months of Professional Base free, 6 months free for Student Master tier graduates.",
  },
  {
    q: "Do fashion and beauty subscriptions work together?",
    a: "Yes. One account can hold both a beauty and fashion profile with a single billing relationship.",
  },
];

function PlanCards({
  plans,
  billing,
}: {
  plans: PlanRow[];
  billing: BillingPeriod;
}) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => {
        const { main, suffix } = displayPrice(plan, billing);
        return (
          <div
            key={plan.name}
            className="flex flex-col rounded-2xl border border-white/10 bg-navy-dark/60 p-6"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-gold/90">
              {plan.name}
            </p>
            <p className="mt-3 font-heading text-3xl font-bold text-offwhite">
              {main}
              <span className="text-lg font-normal text-white/50">{suffix}</span>
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-4 text-sm text-white/65">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function PricingAccordion({
  groups,
  openId,
  setOpenId,
  billing,
}: {
  groups: PlanGroup[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  billing: BillingPeriod;
}) {
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-navy-dark/40">
      {groups.map((group) => {
        const open = openId === group.id;
        return (
          <div key={group.id} className="px-1">
            <button
              type="button"
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.04] sm:px-6"
              onClick={() => setOpenId(open ? null : group.id)}
            >
              <span className="font-heading text-lg font-semibold text-offwhite sm:text-xl">
                {group.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {open ? (
              <div className="border-t border-white/5 px-5 pb-6 sm:px-6">
                <PlanCards plans={group.plans} billing={billing} />
                {group.footnote ? (
                  <p className="mt-4 text-xs text-white/45">{group.footnote}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [openBeauty, setOpenBeauty] = useState<string | null>("student");
  const [openFashion, setOpenFashion] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-navy pb-24 font-body text-white">
      <SectionWrapper className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>Simple, transparent pricing</SectionBadge>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-offwhite md:text-6xl">
            Plans built for your career stage
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Free to start. Upgrade when you&apos;re ready. Subscriptions route
            through the website so you keep 97% of your revenue — not 70%
            through app stores.
          </p>

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:items-center">
            <div
              className="inline-flex w-full rounded-full border border-white/15 bg-navy-dark/80 p-1 shadow-inner md:w-auto"
              role="group"
              aria-label="Billing period"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  billing === "monthly"
                    ? "bg-gold text-navy shadow-sm"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  billing === "yearly"
                    ? "bg-gold text-navy shadow-sm"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
            {billing === "yearly" ? (
              <span className="text-sm font-semibold text-teal">(Save 20%)</span>
            ) : (
              <span className="text-sm text-white/45">
                Toggle to yearly to see annual pricing.
              </span>
            )}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Beauty side pricing
        </h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Expand a category to compare plans. Prices reflect your billing toggle
          above.
        </p>
        <div className="mt-10">
          <PricingAccordion
            groups={BEAUTY_GROUPS}
            openId={openBeauty}
            setOpenId={setOpenBeauty}
            billing={billing}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Fashion side pricing
        </h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Same accordion pattern. Yearly uses 20% off annualized unless we publish
          a fixed annual price.
        </p>
        <div className="mt-10">
          <PricingAccordion
            groups={FASHION_GROUPS}
            openId={openFashion}
            setOpenId={setOpenFashion}
            billing={billing}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10 bg-navy-light/20">
        <div className="rounded-2xl border-2 border-gold/60 bg-gradient-to-br from-gold/10 via-navy-dark/80 to-navy-dark p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Founding Member Offer
          </p>
          <p className="mt-4 max-w-3xl text-pretty font-heading text-xl font-semibold leading-snug text-offwhite sm:text-2xl">
            Join during launch week (June 1–7, 2026) and get 3 months free on any
            annual plan plus a permanent Founding Member badge on your profile.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-b border-white/10">
        <h2 className="font-heading text-3xl font-semibold text-offwhite sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-navy-dark/50">
          {FAQ_ITEMS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="px-1">
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] sm:px-6"
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span className="font-semibold text-offwhite">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div className="border-t border-white/5 px-5 pb-4 sm:px-6">
                    <p className="pt-3 text-sm leading-relaxed text-white/70">
                      {item.a}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-8 py-12 text-center">
          <p className="font-heading text-xl font-semibold text-offwhite sm:text-2xl">
            Still not sure which plan? Start free and upgrade when you&apos;re
            ready.
          </p>
          <div className="mt-8 flex justify-center">
            <GoldButton
              href="/#waitlist"
              label="Start for Free"
              size="lg"
              variant="solid"
            />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
