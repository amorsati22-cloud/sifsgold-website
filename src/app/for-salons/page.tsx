import type { Metadata } from "next";
import { AudienceLandingView } from "@/components/audience/AudienceLandingView";
import { getAudienceLanding } from "@/data/audience-landings";
import { BRAND } from "@/lib/constants";

const SLUG = "for-salons" as const;

const landing = getAudienceLanding(SLUG);
if (!landing) {
  throw new Error(`Missing audience landing config for ${SLUG}`);
}

const config: import("@/types/audience-landing").AudienceLandingConfig = landing;

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: `${BRAND.url}/${SLUG}` },
  openGraph: {
    title: config.title,
    description: config.description,
    url: `/${SLUG}`,
    images: [{ url: `/${SLUG}/opengraph-image`, width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <AudienceLandingView config={config} />;
}
