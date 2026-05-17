import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Compliance",
  description: "SOC 2 readiness, HIPAA posture for med spa workflows, GDPR, CCPA, COPPA, and FTC endorsement transparency.",
  alternates: { canonical: `${BRAND.url}/compliance` },
};

export default function CompliancePage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Compliance", href: "/compliance" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">Year 2 program</p>
          <h1 className="mt-3 font-heading text-4xl font-black text-gold md:text-5xl">Compliance roadmap</h1>
          <p className="mt-4 max-w-3xl text-cream/85">
            Pre-launch polish focuses on honest disclosures and safe defaults. Formal attestations arrive on the calendar
            below — nothing here is a finished audit report.
          </p>
        </div>
      </header>

      <section className="space-y-10 border-b border-gold/10 bg-navy-light/20 py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">SOC 2 Type II readiness — Q1 2027</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            We are aligning logging, change management, and vendor review to SOC 2 expectations. A Type II report is targeted
            for <strong className="text-cream">Q1 2027</strong> once production traffic and control evidence mature.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">HIPAA stance (med spa workflows)</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Optional med-spa documentation lanes follow HIPAA-minded defaults: BAAs where required, minimum-necessary charting,
            and separated marketing consent. Final HIPAA mappings ship with the med spa legal packet — see{" "}
            <Link href="/legal/hipaa-notice" className="text-gold underline-offset-4 hover:underline">
              HIPAA notice (med spa)
            </Link>
            .
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">GDPR, CCPA, and state privacy laws</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            We design for portability, deletion, and opt-out of sale/sharing where those rights apply. Regional supplements will
            layer on top of the base privacy policy at launch.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">COPPA &amp; youth safety</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Accounts for minors follow parental controls, restricted messaging modes, and age-gated commerce — detailed in the
            minor policy at launch.
          </p>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">FTC endorsement transparency</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            Paid relationships, gifted products, and revenue share must disclose clearly in content and captions — we align
            with FTC endorsement guides (including materially connected disclosures) for Sif&apos;s Advocates and brand
            programs.
          </p>
        </div>
      </section>
    </article>
  );
}
