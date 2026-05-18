import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Sif's Gold",
  description:
    "Privacy Policy for Sif's Gold — including cookieless Vercel analytics. Full document coming at launch.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" documentLabel="Privacy Policy">
      <p className="font-mono text-sm text-white/70">
        Vercel Web Analytics and Speed Insights on this site are cookieless by default — they collect
        aggregate page views and performance metrics, not advertising profiles. See the full policy at{" "}
        <a href="/legal/privacy" className="text-gold underline-offset-2 hover:underline">
          /legal/privacy
        </a>
        .
      </p>
    </LegalDocumentLayout>
  );
}
