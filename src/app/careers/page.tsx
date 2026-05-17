import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CareersTalentPoolForm } from "@/components/info/CareersTalentPoolForm";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Sif's Gold is not hiring yet — join the talent pool to hear when we cross $20K MRR and open roles.",
  alternates: { canonical: `${BRAND.url}/careers` },
};

export default function CareersPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Careers", href: "/careers" },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="max-w-3xl font-heading text-4xl font-black leading-tight text-gold md:text-5xl lg:text-6xl">
            We&apos;re not hiring yet — but we will be.
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Sif&apos;s Gold reaches its hiring trigger at <span className="font-semibold text-gold">$20K MRR</span>. When we
            get there, we&apos;ll post open roles here first — starting with the people who already helped us ship with care.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold md:text-3xl">Want to be first to know when we open roles?</h2>
          <p className="mt-3 max-w-2xl text-sm text-cream/80">
            Join the talent pool — one short form, no public job board yet. We&apos;ll only email when there is something real
            to share.
          </p>
          <div className="mx-auto mt-10 max-w-lg rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-6 md:p-8">
            <CareersTalentPoolForm idPrefix="careers" />
          </div>
        </div>
      </section>
    </article>
  );
}
