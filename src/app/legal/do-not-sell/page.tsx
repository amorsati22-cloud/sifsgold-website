import type { Metadata } from "next";
import Link from "next/link";
import { DoNotSellOptOutIllustration } from "@/components/legal/DoNotSellOptOutIllustration";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Do Not Sell My Personal Information",
  description:
    "California residents: Sif's Gold does not sell personal information. Learn how to exercise privacy rights and submit formal requests.",
  alternates: { canonical: `${BRAND.url}/legal/do-not-sell` },
};

export default function DoNotSellPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Do Not Sell My Personal Information (CCPA)" lastUpdated={last} currentPath="/legal/do-not-sell">
      <h2 id="no-sale">We do not sell data</h2>
      <p>
        Sif&apos;s Gold does not sell user data. Period. We do not monetize personal information through data brokers, ad
        networks, or hidden resale channels.
      </p>

      <h2 id="california">Notice for California residents</h2>
      <p>
        If you are a California resident, you have rights under the CCPA/CPRA — including the right to know, delete, and
        correct personal information, and to opt out of sale or sharing. Because we do not sell personal information, there is
        no sale to opt out of — but you can still request access or deletion through the channels below.
      </p>

      <h2 id="per-category">Per-category controls (preview)</h2>
      <p>
        The illustration below shows how granular opt-out toggles will appear alongside plain-language descriptions. Controls
        are not wired to live accounts during private launch.
      </p>
      <DoNotSellOptOutIllustration />

      <h2 id="formal">Formal requests</h2>
      <p>
        Submit a formal CCPA request via our{" "}
        <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
          contact form
        </Link>{" "}
        and choose the closest reason (for example &quot;Other&quot;) with &quot;CCPA request&quot; in the subject line of your message. We
        respond within statutory timelines once the product is in public launch and identity verification is fully staffed.
      </p>
    </LegalLayout>
  );
}
