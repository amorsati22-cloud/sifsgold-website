import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CheckoutContinueButton } from "@/components/checkout/CheckoutContinueButton";
import {
  getPricingTierById,
  isCustomPricingTier,
  isFreePricingTier,
  tierHasFreeTrial,
} from "@/data/pricing";
import { tierSupportsCheckout } from "@/lib/stripe/checkout";

type PageProps = {
  params: { tier: string };
  searchParams: { billing?: string };
};

function formatUSD(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

function resolveBilling(raw?: string): "monthly" | "annual" {
  return raw === "annual" ? "annual" : "monthly";
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tier = getPricingTierById(params.tier);
  return {
    title: tier ? `Checkout — ${tier.name}` : "Checkout",
    robots: { index: false, follow: false },
  };
}

export default function CheckoutTierPage({ params, searchParams }: PageProps) {
  const tier = getPricingTierById(params.tier);
  if (!tier) {
    notFound();
  }

  const billing = resolveBilling(searchParams.billing);

  if (isFreePricingTier(tier)) {
    redirect("/sign-up");
  }

  if (isCustomPricingTier(tier) || tier.ctaType === "contact") {
    redirect("/contact?reason=sales");
  }

  if (!tierSupportsCheckout(tier)) {
    notFound();
  }

  const amount =
    billing === "monthly"
      ? (tier.monthlyPrice ?? 0)
      : (tier.annualPrice ?? 0);
  const billingLabel = billing === "monthly" ? "Monthly" : "Annual";
  const hasTrial = tierHasFreeTrial(tier);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-cream font-body text-navy">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
          { name: "Checkout", href: `/checkout/${tier.id}` },
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">
            Secure checkout
          </p>
          <h1 className="mt-2 font-heading text-4xl font-black text-gold md:text-5xl">
            {tier.name}
          </h1>
          <p className="mt-4 text-lg text-navy/85">
            Review your plan, then continue to Stripe for payment. Taxes are calculated
            automatically at checkout.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section
            aria-labelledby="checkout-summary-heading"
            className="rounded-brand-lg border border-gold/30 bg-white p-6 shadow-sm md:p-8"
          >
            <h2 id="checkout-summary-heading" className="font-heading text-2xl text-navy">
              Order summary
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-navy/10 pb-4">
                <dt className="font-semibold text-navy">Plan</dt>
                <dd className="text-right text-navy/85">{tier.name}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-navy/10 pb-4">
                <dt className="font-semibold text-navy">Billing</dt>
                <dd className="text-right text-navy/85">
                  {billingLabel}
                  {billing === "annual" ? " (billed yearly)" : " (billed monthly)"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-semibold text-navy">Due today</dt>
                <dd className="font-mono text-xl font-bold tabular-nums text-navy">
                  {formatUSD(amount)}
                  <span className="ml-1 text-sm font-medium text-navy/70">
                    {billing === "monthly" ? "/mo" : "/yr"}
                  </span>
                </dd>
              </div>
            </dl>

            {hasTrial ? (
              <p className="mt-4 rounded-brand-md border border-teal/30 bg-teal/5 px-4 py-3 text-sm text-navy">
                Includes a {7}-day free trial. Your card is charged after the trial unless
                you cancel.
              </p>
            ) : null}

            <ul className="mt-8 space-y-2 text-sm text-navy/85">
              <li className="text-xs font-semibold uppercase tracking-wide text-navy/60">
                What&apos;s included
              </li>
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="rounded-brand-lg border border-gold/40 bg-navy p-6 text-cream md:p-8">
            <h2 className="font-heading text-xl text-gold">Ready when you are</h2>
            <p className="mt-3 text-sm text-cream/85">
              {hasTrial
                ? "7-day free trial • cancel anytime • no setup fees"
                : "Cancel anytime • no setup fees • secure Stripe billing"}
            </p>

            <CheckoutContinueButton tierId={tier.id} billing={billing} />

            <p className="mt-6 text-xs text-cream/70">
              Payments are processed by Stripe. Sif&apos;s Gold never stores your card
              number.
            </p>

            <Link
              href="/pricing"
              className="mt-6 inline-block text-sm font-semibold text-gold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Compare other tiers
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
