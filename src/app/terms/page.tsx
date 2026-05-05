import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Sif's Gold",
  description: "Terms of Service for Sif's Gold. Full document coming at launch.",
};

export default function TermsPage() {
  return <LegalDocumentLayout title="Terms of Service" documentLabel="Terms of Service" />;
}
