import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Sif's Gold",
  description: "Privacy Policy for Sif's Gold. Full document coming at launch.",
};

export default function PrivacyPage() {
  return <LegalDocumentLayout title="Privacy Policy" documentLabel="Privacy Policy" />;
}
