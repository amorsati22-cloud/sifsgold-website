import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Content Policy",
  description: "Content Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/content-policy` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Content Policy" currentPath="/legal/content-policy" />;
}
