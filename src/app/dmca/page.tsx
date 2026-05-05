import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "DMCA | Sif's Gold",
  description: "DMCA policy for Sif's Gold. Full document coming at launch.",
};

export default function DmcaPage() {
  return <LegalDocumentLayout title="DMCA" documentLabel="DMCA" />;
}
