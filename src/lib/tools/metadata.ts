import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { getTool } from "@/lib/tools/registry";

export function toolPageMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return { title: "Tool" };
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `${BRAND.url}/tools/${tool.slug}` },
  };
}
