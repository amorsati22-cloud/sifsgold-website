import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "HIPAA Policy",
  description: "HIPAA Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/hipaa` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="HIPAA Policy" currentPath="/legal/hipaa" />;
}
