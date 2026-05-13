import type { Metadata } from "next";
import { FeatureDeepDiveWithSchema } from "@/components/features/FeatureDeepDiveWithSchema";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "health-hub" as const;

const raw = getFeatureDeepDive(SLUG);
if (!raw) {
  throw new Error("Missing feature config for health-hub");
}
const config: FeatureDeepDiveConfig = raw;

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
  alternates: { canonical: `${BRAND.url}/features/${SLUG}` },
};

export default function Page() {
  return (
    <FeatureDeepDiveWithSchema
      config={config}
      gridIntro="Everything in Health Hub is optional — enable only what serves you, and turn it off whenever you want. These tools support awareness, not medical decisions."
    />
  );
}
