import { audienceLandingSlugs } from "@/data/audience-landings";
import { CAREER_PATH_STUBS } from "@/data/career-paths";
import { FEATURE_DEEP_DIVES } from "@/data/feature-deep-dives";
import { HELP_CATEGORIES } from "@/data/help-categories";
import { ALL_STATE_SLUGS } from "@/data/states";

const STATIC_RESERVED = [
  "about",
  "accessibility",
  "account",
  "admin",
  "advocates",
  "api",
  "auth",
  "blog",
  "brand",
  "career-paths",
  "careers",
  "community-guidelines",
  "compliance",
  "contact",
  "cookies",
  "daily",
  "dashboard",
  "explore",
  "data-request",
  "delete",
  "dmca",
  "fashion",
  "features",
  "founding-member",
  "forgot-password",
  "glossary",
  "help",
  "legal",
  "login",
  "manifest",
  "press",
  "pricing",
  "privacy",
  "robots",
  "security",
  "sign-in",
  "sign-up",
  "signup",
  "sitemap",
  "study-guides",
  "state-board-prep",
  "terms",
  "tools",
  "transparency",
  "trust",
  "waitlist-confirmation",
  "www",
  "null",
  "undefined",
  "static",
  "public",
  "_next",
  "favicon",
  "icon",
  "opengraph-image",
] as const;

const RESERVED_SET = new Set<string>([
  ...STATIC_RESERVED,
  ...audienceLandingSlugs,
  ...Object.keys(FEATURE_DEEP_DIVES),
  ...HELP_CATEGORIES.map((c) => c.slug),
  ...CAREER_PATH_STUBS.map((c) => c.slug),
  ...ALL_STATE_SLUGS,
  "tip-calculator",
  "pricing-calculator",
  "license-checker",
  "hours-tracker",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_SET.has(username.toLowerCase());
}

export const RESERVED_USERNAMES = [...RESERVED_SET].sort();
