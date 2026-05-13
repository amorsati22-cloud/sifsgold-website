import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GlossaryClient } from "@/components/glossary/GlossaryClient";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Industry Glossary",
  description: "Beauty, grooming, fitness, and fashion terms — searchable A–Z reference from Sif's Gold.",
  alternates: { canonical: `${BRAND.url}/glossary` },
};

export default function GlossaryPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Glossary", href: "/glossary" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Industry glossary</h1>
          <p className="mt-4 max-w-3xl text-cream/85">
            A–Z language for the room: color, skin, nails, runway, and training. Definitions are educational summaries, not
            legal or medical advice.
          </p>
        </div>
      </header>
      <section className="bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <GlossaryClient />
        </div>
      </section>
    </article>
  );
}
