import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Accessibility | Sif's Gold",
  description: "Accessibility statement for Sif's Gold. Full document coming at launch.",
};

export default function AccessibilityPage() {
  return <LegalDocumentLayout title="Accessibility" documentLabel="Accessibility" />;
}
