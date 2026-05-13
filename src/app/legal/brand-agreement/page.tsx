import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Brand Partner Agreement",
  description: "Brand Partner Agreement for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/brand-agreement` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Brand Partner Agreement" currentPath="/legal/brand-agreement" />;
}
