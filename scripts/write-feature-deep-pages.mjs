import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = path.join(root, "src/app/features");

const pages = [
  { slug: "booking", extra: "standard" },
  { slug: "health-hub", extra: "health" },
  { slug: "photo-studio", extra: "standard" },
  { slug: "music", extra: "standard" },
  { slug: "education", extra: "standard" },
  { slug: "community", extra: "standard" },
  { slug: "payments", extra: "standard" },
  { slug: "privacy", extra: "privacy" },
  { slug: "ai", extra: "standard" },
  { slug: "state-boards", extra: "state" },
  { slug: "brand-deals", extra: "standard" },
  { slug: "marketplace", extra: "standard" },
];

const standardPage = (slug) => `import type { Metadata } from "next";
import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "${slug}" as const;

const raw = getFeatureDeepDive(SLUG);
if (!raw) {
  throw new Error(\`Missing feature config for \${SLUG}\`);
}
const config: FeatureDeepDiveConfig = raw;

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
  alternates: { canonical: \`\${BRAND.url}/features/\${SLUG}\` },
};

export default function Page() {
  return <FeatureDeepDiveView config={config} />;
}
`;

const healthPage = `import type { Metadata } from "next";
import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
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
  alternates: { canonical: \`\${BRAND.url}/features/\${SLUG}\` },
};

export default function Page() {
  return (
    <FeatureDeepDiveView
      config={config}
      gridIntro="Everything in Health Hub is optional — enable only what serves you, and turn it off whenever you want. These tools support awareness, not medical decisions."
    />
  );
}
`;

const privacyPage = `import type { Metadata } from "next";
import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
import { FeaturePrivacyExtras } from "@/components/features/FeaturePrivacyExtras";
import { getFeatureDeepDive } from "@/data/feature-deep-dives";
import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";
import { BRAND } from "@/lib/constants";

const SLUG = "privacy" as const;

const raw = getFeatureDeepDive(SLUG);
if (!raw) {
  throw new Error("Missing feature config for privacy");
}
const config: FeatureDeepDiveConfig = raw;

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
  alternates: { canonical: \`\${BRAND.url}/features/\${SLUG}\` },
};

export default function Page() {
  return (
    <FeatureDeepDiveView config={config}>
      <FeaturePrivacyExtras />
    </FeatureDeepDiveView>
  );
}
`;

const statePage = `import type { Metadata } from "next";
import { FeatureDeepDiveView } from "@/components/features/FeatureDeepDiveView";
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
  alternates: { canonical: \`\${BRAND.url}/features/\${SLUG}\` },
};

export default function Page() {
  return (
    <FeatureDeepDiveView config={config}>
      <FeatureStateBoardsExtras />
    </FeatureDeepDiveView>
  );
}
`;

for (const { slug, extra } of pages) {
  const dir = path.join(base, slug);
  fs.mkdirSync(dir, { recursive: true });
  let body;
  if (extra === "health") body = healthPage;
  else if (extra === "privacy") body = privacyPage;
  else if (extra === "state") body = statePage;
  else body = standardPage(slug);
  fs.writeFileSync(path.join(dir, "page.tsx"), body);
}

console.error("Wrote", pages.length, "feature deep-dive pages");
