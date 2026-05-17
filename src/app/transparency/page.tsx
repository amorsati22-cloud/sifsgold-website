import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Transparency Report",
  description: "Planned transparency reporting for government requests, moderation, and DMCA notices — Q1 2027.",
  alternates: { canonical: `${BRAND.url}/transparency` },
};

export default function TransparencyPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Transparency", href: "/transparency" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">Year 2 program</p>
          <h1 className="mt-3 font-heading text-4xl font-black text-gold md:text-5xl">Transparency report</h1>
          <p className="mt-4 max-w-3xl text-lg text-cream/88">
            Our <strong className="text-gold">first transparency report publishes Q1 2027</strong> once we have a full year of
            production signals worth publishing — volume matters more than vanity PDFs.
          </p>
        </div>
      </header>

      <section className="bg-navy-light/20 py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">What the report will cover</h2>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-relaxed text-cream/85">
            <li>
              <strong className="text-cream">Government requests</strong> — criminal subpoenas, preservation requests, and
              emergency disclosures, aggregated with narrative context where legally allowed.
            </li>
            <li>
              <strong className="text-cream">Content moderation</strong> — appeals volume, turnaround times, and policy
              updates affecting The Gold Collective.
            </li>
            <li>
              <strong className="text-cream">DMCA notices</strong> — takedowns, counter-notices, and repeat infringer
              actions, cross-linked to our{" "}
              <Link href="/legal/dmca" className="text-gold underline-offset-4 hover:underline">
                DMCA policy
              </Link>
              .
            </li>
          </ul>
          <p className="mt-8 text-sm text-cream/70">
            Until the report ships, use the contact and legal pages for formal requests — we route everything through tracked
            workflows.
          </p>
        </div>
      </section>
    </article>
  );
}
