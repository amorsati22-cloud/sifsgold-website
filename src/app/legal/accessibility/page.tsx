import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Sif's Gold accessibility commitment — WCAG 2.1 Level AA target and how to report barriers via the contact form.",
  alternates: { canonical: `${BRAND.url}/legal/accessibility` },
};

export default function AccessibilityStatementPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Accessibility Statement" lastUpdated={last} currentPath="/legal/accessibility">
      <h2 id="commitment">Our commitment</h2>
      <p>
        We strive for WCAG 2.1 Level AA conformance across marketing pages and the product experience. Accessibility is an
        ongoing practice — not a one-time audit checkbox — especially in industries where clients and providers rely on clear
        contrast, predictable focus order, and readable language.
      </p>

      <h2 id="conformance">Conformance status</h2>
      <p>
        We target WCAG 2.1 AA for new and substantially updated surfaces. Older content may still be undergoing remediation as
        we ship in private launch.
      </p>

      <h2 id="report">Report an issue</h2>
      <p>
        We strive for full compliance. If you encounter a barrier — keyboard traps, missing labels, poor contrast, confusing
        errors — report it via our{" "}
        <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
          contact form
        </Link>{" "}
        with the page URL and a short description of what went wrong. We track issues and prioritize fixes that unblock real
        users.
      </p>

      <h2 id="improvement">Ongoing improvement</h2>
      <p>
        We test with automated scanners and manual keyboard reviews, and we work with Sif&apos;s Advocates to catch domain-specific
        patterns (for example booking flows and consent screens) that generic checklists miss.
      </p>
    </LegalLayout>
  );
}
