"use client";

import type { ToolSlug } from "@/types/tools";

const STORAGE_KEY = "sifs-tools-recent";
const MAX_RECENT = 6;

export function recordToolVisit(slug: ToolSlug): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = (raw ? JSON.parse(raw) : []) as ToolSlug[];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getRecentTools(): ToolSlug[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return (raw ? JSON.parse(raw) : []) as ToolSlug[];
  } catch {
    return [];
  }
}
