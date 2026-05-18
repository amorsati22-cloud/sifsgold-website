"use client";

import { useEffect } from "react";
import { recordToolVisit } from "@/lib/tools/recent";
import type { ToolSlug } from "@/types/tools";

export function ToolVisitTracker({ slug }: { slug: ToolSlug }) {
  useEffect(() => {
    recordToolVisit(slug);
  }, [slug]);
  return null;
}
