import type { Metadata } from "next";
import { CareersInquiryForm } from "@/components/marketing/CareersInquiryForm";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

export const metadata: Metadata = {
  title: "Careers | Sif's Gold",
  description:
    "Help shape the beauty and fashion platform built for the industry — advisor, consultant, and future team conversations.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Build the platform with us.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Sif&apos;s Gold is early stage and founder-led. We&apos;re not hiring full-time roles
            right now, but we&apos;re always open to conversations with people who are deeply
            embedded in the beauty or fashion industries and want to help shape what this platform
            becomes.
          </p>
        </div>
      </header>

      <section className="border-t border-white/10 bg-gradient-to-b from-navy-light/20 to-navy py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Interested?</h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-white/70">
            If you work in beauty or fashion and want to contribute — as an advisor, consultant,
            or future team member — reach out through the contact form.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-navy-dark/50 p-6 sm:p-8">
            <CareersInquiryForm accessKey={web3formsWaitlistAccessKey} />
          </div>
        </div>
      </section>
    </div>
  );
}
