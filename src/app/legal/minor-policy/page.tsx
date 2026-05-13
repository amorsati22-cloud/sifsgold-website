import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Minor Safety Policy",
  description: "Minor Safety Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/minor-policy` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Minor Safety Policy" currentPath="/legal/minor-policy" />;
}
