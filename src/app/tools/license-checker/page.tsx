import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LicenseCheckerClient } from "@/components/tools/LicenseCheckerClient";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "License Renewal Checker",
  description: "Preview renewal cycles and CE hour placeholders by state — verify with your board.",
  alternates: { canonical: `${BRAND.url}/tools/license-checker` },
};

export default function LicenseCheckerPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools/license-checker" },
          { name: "License checker", href: "/tools/license-checker" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">License renewal checker</h1>
          <p className="mt-4 max-w-2xl text-cream/80">
            Uses the same marketing stubs as study guides — always confirm renewal windows and CE categories with your state
            board.
          </p>
        </div>
      </header>
      <section className="bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-6 shadow-xl backdrop-blur-md md:p-10">
            <LicenseCheckerClient />
          </div>
        </div>
      </section>
    </article>
  );
}
