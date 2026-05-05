import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Data Request | Sif's Gold",
  description: "Data request information for Sif's Gold. Full document coming at launch.",
};

export default function DataRequestPage() {
  return <LegalDocumentLayout title="Data Request" documentLabel="Data Request" />;
}
