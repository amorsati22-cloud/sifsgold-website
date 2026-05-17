import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PricingCalculatorClient } from "@/components/tools/PricingCalculatorClient";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Pricing Calculator",
  description: "Estimate a profitable service price from time, product cost, overhead, and margin targets.",
  alternates: { canonical: `${BRAND.url}/tools/pricing-calculator` },
};

export default function PricingCalculatorPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools/pricing-calculator" },
          { name: "Pricing calculator", href: "/tools/pricing-calculator" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Service pricing calculator</h1>
          <p className="mt-4 max-w-2xl text-cream/80">Built for pros pricing with margin, not guilt.</p>
        </div>
      </header>
      <section className="bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-6 shadow-xl backdrop-blur-md md:p-10">
            <PricingCalculatorClient />
          </div>
        </div>
      </section>
    </article>
  );
}
