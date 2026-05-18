import type { MetadataRoute } from "next";
import { audienceLandingSlugs } from "@/data/audience-landings";
import { CAREER_PATH_STUBS } from "@/data/career-paths";
import { FEATURE_DEEP_DIVES } from "@/data/feature-deep-dives";
import { HELP_CATEGORIES } from "@/data/help-categories";
import { ALL_STATE_SLUGS } from "@/data/states";
import { getAllPosts, getAllTags, tagToSlug } from "@/lib/blog";
import { BRAND, LEGAL_PAGES } from "@/lib/constants";
import { getVisibleProUsernames } from "@/lib/pro-profiles";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

function push(
  out: Array<{ path: string; changeFrequency: ChangeFreq; priority: number }>,
  path: string,
  changeFrequency: ChangeFreq,
  priority: number,
) {
  out.push({ path, changeFrequency, priority });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: Array<{ path: string; changeFrequency: ChangeFreq; priority: number }> = [];

  push(routes, "/", "weekly", 1.0);
  push(routes, "/about", "monthly", 0.95);
  push(routes, "/pricing", "weekly", 0.95);
  push(routes, "/press", "monthly", 0.55);
  push(routes, "/contact", "monthly", 0.75);
  push(routes, "/careers", "monthly", 0.65);
  push(routes, "/brand", "monthly", 0.65);
  push(routes, "/help", "weekly", 0.7);
  push(routes, "/delete", "yearly", 0.35);
  push(routes, "/blog", "weekly", 0.7);
  push(routes, "/blog/rss.xml", "weekly", 0.4);
  for (const post of getAllPosts()) {
    push(routes, `/blog/${post.slug}`, "monthly", 0.55);
  }
  for (const tag of getAllTags()) {
    push(routes, `/blog/tag/${tagToSlug(tag)}`, "monthly", 0.45);
  }
  push(routes, "/fashion", "monthly", 0.55);
  push(routes, "/features", "weekly", 0.85);

  push(routes, "/study-guides", "weekly", 0.8);
  for (const state of ALL_STATE_SLUGS) {
    push(routes, `/study-guides/${state}`, "monthly", 0.65);
  }

  push(routes, "/career-paths", "weekly", 0.78);
  for (const c of CAREER_PATH_STUBS) {
    push(routes, `/career-paths/${c.slug}`, "monthly", 0.65);
  }

  push(routes, "/glossary", "monthly", 0.65);
  push(routes, "/tools/tip-calculator", "monthly", 0.55);
  push(routes, "/tools/pricing-calculator", "monthly", 0.55);
  push(routes, "/tools/license-checker", "monthly", 0.55);
  push(routes, "/tools/hours-tracker", "monthly", 0.5);

  push(routes, "/trust", "monthly", 0.65);
  push(routes, "/security", "monthly", 0.65);
  push(routes, "/compliance", "yearly", 0.45);
  push(routes, "/transparency", "yearly", 0.45);

  push(routes, "/advocates", "monthly", 0.7);
  push(routes, "/advocates/apply", "monthly", 0.65);
  push(routes, "/founding-member", "monthly", 0.7);
  push(routes, "/sign-up", "monthly", 0.55);
  push(routes, "/sign-in", "monthly", 0.45);
  push(routes, "/forgot-password", "yearly", 0.35);
  push(routes, "/waitlist-confirmation", "yearly", 0.35);

  push(routes, "/accessibility", "yearly", 0.35);
  push(routes, "/community-guidelines", "yearly", 0.35);
  push(routes, "/cookies", "yearly", 0.35);
  push(routes, "/data-request", "yearly", 0.35);
  push(routes, "/dmca", "yearly", 0.35);
  push(routes, "/privacy", "yearly", 0.35);
  push(routes, "/terms", "yearly", 0.35);

  for (const slug of audienceLandingSlugs) {
    push(routes, `/${slug}`, "weekly", 0.9);
  }

  for (const slug of Object.keys(FEATURE_DEEP_DIVES)) {
    push(routes, `/features/${slug}`, "weekly", 0.8);
  }

  for (const row of HELP_CATEGORIES) {
    push(routes, `/help/${row.slug}`, "weekly", 0.55);
  }

  const legalSet = new Set<string>([
    ...LEGAL_PAGES.map((p) => p.href),
    "/legal/refunds",
    "/legal/cancellation",
    "/legal/do-not-sell",
    "/legal/data-deletion",
    "/legal/hipaa",
  ]);
  for (const href of legalSet) {
    push(routes, href, "yearly", 0.5);
  }

  const proUsernames = await getVisibleProUsernames();
  for (const username of proUsernames) {
    push(routes, `/${username}`, "weekly", 0.75);
    push(routes, `/${username}/portfolio`, "weekly", 0.55);
    push(routes, `/${username}/services`, "weekly", 0.6);
    push(routes, `/${username}/credentials`, "monthly", 0.45);
    push(routes, `/${username}/reviews`, "weekly", 0.5);
  }

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BRAND.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
