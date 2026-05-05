import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Community Guidelines | Sif's Gold",
  description: "Community Guidelines for Sif's Gold. Full document coming at launch.",
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalDocumentLayout title="Community Guidelines" documentLabel="Community Guidelines" />
  );
}
