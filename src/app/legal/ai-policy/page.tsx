import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "AI Policy",
  description: "AI Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/ai-policy` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="AI Policy" currentPath="/legal/ai-policy" />;
}
