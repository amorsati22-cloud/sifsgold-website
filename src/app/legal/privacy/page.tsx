import type { Metadata } from "next";
import { LegalReviewPlaceholder } from "@/components/legal/LegalReviewPlaceholder";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Sif's Gold — under legal review until June 2026 public launch.",
  alternates: { canonical: `${BRAND.url}/legal/privacy` },
};

export default function Page() {
  return <LegalReviewPlaceholder title="Privacy Policy" currentPath="/legal/privacy" />;
}
