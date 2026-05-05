import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | Sif's Gold",
  description: "Cookie Policy for Sif's Gold. Full document coming at launch.",
};

export default function CookiesPage() {
  return <LegalDocumentLayout title="Cookie Policy" documentLabel="Cookie Policy" />;
}
