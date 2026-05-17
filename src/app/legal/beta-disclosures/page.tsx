import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beta Disclosures",
  description: "Beta Disclosures for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/beta-disclosures` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Beta Disclosures" currentPath="/legal/beta-disclosures" />;
}
