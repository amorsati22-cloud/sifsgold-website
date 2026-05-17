import type { Metadata } from "next";
import { FeatureDeepDiveWithSchema } from "@/components/features/FeatureDeepDiveWithSchema";
import { FeatureStateBoardsExtras } from "@/components/features/FeatureStateBoardsExtras";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "state-boards" as const;

const raw = getFeatureDeepDive(SLUG);
if (!raw) {
  throw new Error("Missing feature config for state-boards");
}
const config: FeatureDeepDiveConfig = raw;

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
  alternates: { canonical: `${BRAND.url}/features/${SLUG}` },
};

export default function Page() {
  return (
    <FeatureDeepDiveWithSchema config={config}>
      <FeatureStateBoardsExtras />
    </FeatureDeepDiveWithSchema>
  );
}
