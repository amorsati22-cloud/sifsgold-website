import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "Acceptable Use Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/acceptable-use` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Acceptable Use Policy" currentPath="/legal/acceptable-use" />;
}
