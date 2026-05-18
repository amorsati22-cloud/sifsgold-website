import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Sif's Gold uses cookies and similar technologies — essential, functional, and privacy-first analytics.",
  alternates: { canonical: `${BRAND.url}/legal/cookies` },
};

export default function CookiesPolicyPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Cookie Policy" lastUpdated={last} currentPath="/legal/cookies">
      <h2 id="overview">Overview</h2>
      <p>
        Sif&apos;s Gold uses a small set of cookies and similar technologies to keep your session secure, remember
        preferences you explicitly set, and understand product health. We do not use tracking pixels or third-party advertising
        cookies.
      </p>

      <h2 id="essential">Essential cookies</h2>
      <p>
        These cookies are required for core security and account flows — for example keeping you signed in during an active
        session and protecting forms from automated abuse. They cannot be disabled without breaking basic functionality.
      </p>

      <h2 id="functional">Functional cookies</h2>
      <p>
        When you choose preferences in the product (such as reduced motion or cookie choices saved in our consent layer),
        functional cookies or local storage may remember those selections so you do not have to reconfigure every visit.
      </p>

      <h2 id="analytics">Analytics (cookieless, always on)</h2>
      <p>
        We use Vercel Web Analytics and Vercel Speed Insights. Vercel documents Web Analytics as not using
        third-party cookies — data is aggregated and not used to reconstruct cross-site browsing sessions.
        Speed Insights reports anonymous performance metrics (such as Core Web Vitals) without identifying
        visitors. These services load automatically and are not toggled in cookie preferences.
      </p>

      <h2 id="opt-out">Opting out</h2>
      <p>
        Where a category is optional, you can withdraw consent through our cookie preferences UI when it is enabled for your
        account or device. Essential cookies remain for security even if other categories are off.
      </p>

      <h2 id="no-ads">No ad-tech cookies</h2>
      <p>
        We do not use tracking pixels or third-party advertising cookies. Partner surfaces inside The Gold Collective are
        contextual — not retargeting networks.
      </p>

      <h2 id="contact">Questions</h2>
      <p>
        For privacy questions or data requests, use the{" "}
        <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
          contact form
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
