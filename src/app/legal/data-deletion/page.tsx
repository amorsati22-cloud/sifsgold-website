import type { Metadata } from "next";
import Link from "next/link";
import { LegalDataDeletionForm } from "@/components/legal/LegalDataDeletionForm";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Data Deletion Request",
  description:
    "Request deletion of your Sif's Gold account data — required disclosures for App Store guidelines and privacy programs.",
  alternates: { canonical: `${BRAND.url}/legal/data-deletion` },
};

export default function DataDeletionLegalPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="Data Deletion Request" lastUpdated={last} currentPath="/legal/data-deletion">
      <h2 id="right">Your right to deletion</h2>
      <p>
        You have the right to request deletion of your data at any time, subject to limited legal exceptions (for example
        records we must retain to meet financial or safety obligations). This page satisfies Apple App Store account deletion
        disclosure requirements alongside our in-product deletion path when accounts are live.
      </p>

      <h2 id="how">How requests work</h2>
      <p>
        Submit the form below with the email address associated with your account. We will verify ownership before processing.
        If you also use our general account deletion page at{" "}
        <Link href="/delete" className="font-semibold text-gold underline-offset-4 hover:underline">
          /delete
        </Link>
        , either path reaches the same operations team — pick whichever is easier.
      </p>

      <h2 id="form">Request form</h2>
      <LegalDataDeletionForm idPrefix="legal-data-del" />
    </LegalLayout>
  );
}
