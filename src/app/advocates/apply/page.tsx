import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdvocateApplicationForm } from "@/components/advocates/AdvocateApplicationForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Apply | Sif's Advocates",
  description: "Apply to the Sif's Advocate Program — founding cohort and Founding Gold consideration.",
  alternates: { canonical: `${BRAND.url}/advocates/apply` },
};

export default function AdvocateApplyPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Advocates", href: "/advocates" },
          { name: "Apply", href: "/advocates/apply" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <Link
            href="/advocates"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold underline-offset-4 hover:text-gold-light hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Advocate overview
          </Link>
          <h1 className="mt-6 font-heading text-4xl font-bold text-gold md:text-5xl">Apply to Sif&apos;s Advocates</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Tell us who you are, where you publish, and why Sif&apos;s Gold fits your craft. We read every application — no
            auto-reject based on follower count.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-navy-dark/70 p-8 shadow-xl backdrop-blur-md sm:p-10">
          <AdvocateApplicationForm idPrefix="advocate-apply" />
        </div>
      </div>
    </article>
  );
}
