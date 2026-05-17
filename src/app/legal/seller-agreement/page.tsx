import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Seller Agreement",
  description: "Seller Agreement for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/seller-agreement` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Seller Agreement" currentPath="/legal/seller-agreement" />;
}
