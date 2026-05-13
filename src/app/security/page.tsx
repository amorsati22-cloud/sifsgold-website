import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Security",
  description: "How Sif's Gold protects accounts, sensitive data, and payments — encryption, 2FA, Stripe, Supabase, Vercel.",
  alternates: { canonical: `${BRAND.url}/security` },
};

export default function SecurityPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Security", href: "/security" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Security</h1>
          <p className="mt-4 max-w-3xl text-cream/85">
            We ship like a payments company wearing a creative suite: least privilege, audited vendors, and clear escalation
            when something looks off.
          </p>
        </div>
      </header>

      <section className="space-y-12 border-b border-gold/10 bg-navy-light/20 py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Encryption</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            <strong className="text-cream">Tier A zero-knowledge envelope</strong> for the most sensitive client signals —
            keys stay client-bound where the product design calls for it. Everything else rides industry-standard TLS in
            transit and encrypted storage patterns on the server side.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Authentication</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Passwordless-first flows where we can, biometric unlock on supported devices, and <strong className="text-cream">2FA required for all financial actions</strong> — payouts, bank changes, large refunds, and gift-card issuance.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Payment security</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Card-present and online flows use <strong className="text-cream">Stripe Connect</strong> with hosted elements where
            possible. PCI-DSS scope is minimized because Stripe handles raw card data — we integrate via their recommended
            patterns and monitor webhook integrity.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Infrastructure</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Application and database layers target <strong className="text-cream">Supabase Pro</strong> with row-level security
            defaults, while the marketing site and edge delivery run on <strong className="text-cream">Vercel</strong> with
            hardened headers and automated TLS.
          </p>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 md:px-8">
          <p className="text-sm text-cream/80">
            Report a security issue through our{" "}
            <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
              contact form
            </Link>{" "}
            — select the closest reason so it routes quickly.
          </p>
        </div>
      </section>
    </article>
  );
}
