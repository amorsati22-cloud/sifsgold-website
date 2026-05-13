import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/sign-up/internal"],
      },
    ],
    sitemap: `${BRAND.url}/sitemap.xml`,
  };
}
