import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const app = path.join(root, "src/app");

const slugs = [
  "for-clients",
  "for-pros",
  "for-students",
  "for-schools",
  "for-salons",
  "for-fashion",
  "for-brands",
  "for-storefronts",
  "for-barbers",
  "for-tattoo-artists",
  "for-nail-techs",
  "for-lash-artists",
  "for-brow-artists",
  "for-massage-therapists",
  "for-makeup-artists",
  "for-estheticians",
  "for-medspa-providers",
  "for-trainers",
  "for-barbershops",
  "for-tattoo-shops",
  "for-piercing-studios",
  "for-nail-salons",
  "for-lash-brow-studios",
  "for-medspas",
  "for-fitness-studios",
  "for-solo-studios",
  "for-models",
  "for-modeling-agencies",
  "for-designers",
  "for-casting-directors",
  "for-showrooms",
  "for-clothing-brands",
  "for-fashion-events",
];

const pageTemplate = (slug) => `import type { Metadata } from "next";
import { AudienceLandingView } from "@/components/audience/AudienceLandingView";
import { getAudienceLanding } from "@/data/audience-landings";
import { BRAND } from "@/lib/constants";

const SLUG = "${slug}" as const;

const landing = getAudienceLanding(SLUG);
if (!landing) {
  throw new Error(\`Missing audience landing config for \${SLUG}\`);
}

const config: import("@/types/audience-landing").AudienceLandingConfig = landing;

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: \`\${BRAND.url}/\${SLUG}\` },
  openGraph: {
    title: config.title,
    description: config.description,
    url: \`/\${SLUG}\`,
    images: [{ url: \`/\${SLUG}/opengraph-image\`, width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <AudienceLandingView config={config} />;
}
`;

const ogTemplate = (slug) => `import { audienceOgContentType, audienceOgSize, createAudienceOpenGraphImageResponse } from "@/lib/audience-og-image";
import { getAudienceLanding } from "@/data/audience-landings";

export const runtime = "edge";
export const alt = "Sif's Gold — audience preview";
export const contentType = audienceOgContentType;
export const size = audienceOgSize;

export default function OpenGraphImage() {
  const landing = getAudienceLanding("${slug}");
  const title = landing?.openGraphTitle ?? "Sif's Gold";
  return createAudienceOpenGraphImageResponse(title);
}
`;

for (const slug of slugs) {
  const dir = path.join(app, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  fs.writeFileSync(path.join(dir, "opengraph-image.tsx"), ogTemplate(slug));
}

console.error("Wrote", slugs.length, "audience routes under src/app");
