import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContactPageForm } from "@/components/info/ContactPageForm";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Sif's Gold",
  description: "Send a message to the Sif's Gold team — general, press, partnership, investor, or bug reports.",
  alternates: { canonical: `${BRAND.url}/contact` },
};

export default function ContactPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-14 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Contact Sif&apos;s Gold</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/85">
            Use the secure form below — we route messages through Web3Forms with our launch configuration (placeholder until
            Fastmail is wired). We never display a public inbox address here.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/15 py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ContactPageForm idPrefix="contact" />
          <div className="mx-auto mt-10 max-w-xl border-t border-gold/15 pt-8 text-sm leading-relaxed text-cream/80">
            <p>
              For DMCA notices, see our{" "}
              <Link href="/legal/dmca" className="font-semibold text-gold underline-offset-4 hover:underline">
                DMCA policy
              </Link>
              . For privacy or data requests, see our{" "}
              <Link href="/legal/privacy" className="font-semibold text-gold underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
