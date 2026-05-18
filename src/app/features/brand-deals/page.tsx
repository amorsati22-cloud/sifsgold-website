import type { Metadata } from "next";
import { FeatureDeepDiveWithSchema } from "@/components/features/FeatureDeepDiveWithSchema";
import { GoldButton } from "@/components/ui/GoldButton";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "brand-deals" as const;

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
  return (
    <FeatureDeepDiveWithSchema config={config}>
      <section className="mx-auto mt-12 max-w-2xl rounded-brand-lg border border-gold/25 bg-navy-deep/80 p-8 text-center">
        <h2 className="font-heading text-2xl text-gold">Brand Deal Marketplace</h2>
        <p className="mt-3 font-body text-cream/85">
          Gold Partners post escrow-funded campaigns. Sif&apos;s Advocates apply, sign contracts in-app, and get paid
          on deliverable approval — with FTC §255 disclosure checks and a 70/30 advocate/platform split.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <GoldButton label="Gold Partner dashboard" href="/dashboard/brand-deals" variant="solid" />
          <GoldButton label="Browse campaigns" href="/brand-deals/marketplace" variant="outlined" />
          <GoldButton label="Advocate dashboard" href="/dashboard/advocate/brand-deals" variant="ghost" />
        </div>
      </section>
    </FeatureDeepDiveWithSchema>
  );
}
