import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getPricingTierById } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { tier?: string };
};

export default function CheckoutCancelPage({ searchParams }: PageProps) {
  const tier = searchParams.tier ? getPricingTierById(searchParams.tier) : null;

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-cream font-body text-navy">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
          { name: "Checkout canceled", href: "/checkout/cancel" },
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <header className="max-w-2xl">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">
            Changed your mind?
          </h1>
          <p className="mt-4 text-lg text-navy/85">
            {tier
              ? `You stepped away from ${tier.name} — no charges were made.`
              : "Your checkout was canceled — no charges were made."}
          </p>
        </header>

        <section className="mt-10 max-w-2xl rounded-brand-lg border border-gold/30 bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-heading text-2xl text-navy">What you&apos;re missing</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-navy/85">
            <li>One platform for bookings, payments, and client relationships</li>
            <li>Stripe-powered subscriptions with automatic tax and secure billing</li>
            <li>Access to The Gold Collective — peers, Sif&apos;s Advocates, and Gold Partners</li>
            {tier
              ? tier.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)
              : null}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Try another tier
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </article>
  );
}
