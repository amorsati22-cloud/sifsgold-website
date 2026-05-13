import type { Metadata } from "next";
import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "photo-studio" as const;

const raw = getFeatureDeepDive(SLUG);
if (!raw) {
  throw new Error(`Missing feature config for ${SLUG}`);
}
const config: FeatureDeepDiveConfig = raw;

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
  alternates: { canonical: `${BRAND.url}/features/${SLUG}` },
};

export default function Page() {
  return <FeatureDeepDiveView config={config} />;
}
