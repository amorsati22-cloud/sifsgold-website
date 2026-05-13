import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "State Disclosures",
  description: "State Disclosures for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/state-disclosures` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="State Disclosures" currentPath="/legal/state-disclosures" />;
}
