import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sif's Advocate Agreement",
  description: "Sif's Advocate Agreement for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/advocate-agreement` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Sif's Advocate Agreement" currentPath="/legal/advocate-agreement" />;
}
