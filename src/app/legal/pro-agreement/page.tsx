import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Professional Agreement",
  description: "Professional Agreement for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/pro-agreement` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Professional Agreement" currentPath="/legal/pro-agreement" />;
}
