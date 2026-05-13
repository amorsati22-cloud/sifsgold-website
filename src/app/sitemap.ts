import type { MetadataRoute } from "next";
import { BRAND, LEGAL_PAGES } from "@/lib/constants";

const ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/press", changeFrequency: "monthly", priority: 0.5 },
  { path: "/delete", changeFrequency: "yearly", priority: 0.3 },
  ...LEGAL_PAGES.filter((page) => page.href.startsWith("/legal/")).map((page) => ({
    path: page.href,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BRAND.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
