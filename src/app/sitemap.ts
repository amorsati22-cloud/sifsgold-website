import type { MetadataRoute } from "next";

const BASE = "https://sifsgold.com";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/for-professionals", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-students", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-clients", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-schools", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-salons", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-barbershops", changeFrequency: "weekly", priority: 0.9 },
  { path: "/for-storefronts", changeFrequency: "weekly", priority: 0.85 },
  { path: "/for-brands", changeFrequency: "weekly", priority: 0.85 },
  { path: "/fashion", changeFrequency: "weekly", priority: 0.85 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/press", changeFrequency: "monthly", priority: 0.75 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.75 },
  { path: "/help", changeFrequency: "weekly", priority: 0.85 },
  { path: "/sign-in", changeFrequency: "monthly", priority: 0.3 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/community-guidelines", changeFrequency: "yearly", priority: 0.4 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.4 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.4 },
  { path: "/data-request", changeFrequency: "yearly", priority: 0.4 },
  { path: "/dmca", changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
