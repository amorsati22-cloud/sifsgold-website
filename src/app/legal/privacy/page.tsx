import type { Metadata } from "next";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Sif's Gold — including Health Hub encryption, no sale of health data, and your export and deletion rights.",
  alternates: { canonical: `${BRAND.url}/legal/privacy` },
};

export default function Page() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Privacy Policy" lastUpdated={last} currentPath="/legal/privacy">
      <HealthHubPrivacySection last={last} />
    </LegalLayout>
  );
}

function HealthHubPrivacySection({ last }: { last: string }) {
  return (
    <>
      <p>
        This policy describes how Sif&apos;s Gold handles personal information on our website and in member
        accounts. Health Hub has additional protections summarized below.
      </p>

      <h2>Health Hub (wellness tracking)</h2>
      <p>
        Health Hub is an optional wellness tracking feature — not a medical record system. If you opt in:
      </p>
      <ul>
        <li>
          <strong>Encryption at rest:</strong> Health Hub notes and intentions are encrypted at rest using
          AES-256 via PostgreSQL pgcrypto in your Supabase-backed account.
        </li>
        <li>
          <strong>Staff access:</strong> Sif&apos;s Gold staff cannot access individual user Health Hub
          data. Database policies explicitly deny service-role access to health tables.
        </li>
        <li>
          <strong>No sale or ads:</strong> We never share, sell, or use Health Hub data for advertising,
          brand partner analytics, or third-party marketing.
        </li>
        <li>
          <strong>Your control:</strong> You can export or permanently delete your Health Hub data at any
          time from Health Hub Settings.
        </li>
        <li>
          <strong>Browser storage:</strong> Health Hub wellness data is not stored in browser localStorage;
          it is stored only in your encrypted cloud account after explicit opt-in.
        </li>
      </ul>
      <p>
        Health Hub does not provide medical advice, fertility prediction, or medication dosing
        recommendations. See the{" "}
        <a href="/dashboard/health-hub/disclaimer" className="text-gold underline-offset-2 hover:underline">
          Health Hub disclaimer
        </a>{" "}
        for full terms.
      </p>

      <h2>Website analytics (cookieless)</h2>
      <p>
        We use Vercel Web Analytics and Vercel Speed Insights to understand aggregate traffic and page
        performance. Per Vercel&apos;s documentation, Web Analytics does not use third-party cookies — visitors
        are identified by a request hash for aggregated statistics, not cross-site ad profiles. Speed Insights
        collects anonymous performance metrics (for example Core Web Vitals) without tying data to an
        individual. These tools load on every visit and are not controlled by our cookie preference banner.
      </p>

      <p className="mt-6 text-sm text-cream/70">
        Additional policy sections are under final legal review before public launch in June 2026. Last
        updated: {last}
      </p>
    </>
  );
}
