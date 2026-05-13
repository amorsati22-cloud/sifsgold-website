import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TipCalculatorClient } from "@/components/tools/TipCalculatorClient";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tip Calculator",
  description: "Estimate service totals with tax and tip for beauty and grooming appointments.",
  alternates: { canonical: `${BRAND.url}/tools/tip-calculator` },
};

export default function TipCalculatorPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools/tip-calculator" },
          { name: "Tip calculator", href: "/tools/tip-calculator" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Tip calculator</h1>
          <p className="mt-4 max-w-2xl text-cream/80">Service price, tax, and gratuity — quick math for the chair.</p>
        </div>
      </header>
      <section className="bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-6 shadow-xl backdrop-blur-md md:p-10">
            <TipCalculatorClient />
          </div>
        </div>
      </section>
    </article>
  );
}
