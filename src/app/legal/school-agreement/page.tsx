import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "School Agreement",
  description: "School Agreement for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/school-agreement` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="School Agreement" currentPath="/legal/school-agreement" />;
}
