import type { SignupUserTypeSlug } from "@/data/signup-user-types";

/** Maps sign-up picker slugs to `profiles.user_type` values. */
export const SIGNUP_SLUG_TO_USER_TYPE: Record<SignupUserTypeSlug, string> = {
  student: "student",
  "licensed-pro": "licensed_pro",
  "salon-studio": "salon",
  "beauty-fitness-school": "school",
  "fashion-industry": "fashion_pro",
  "storefront-brand": "brand_partner",
  "brand-partner": "brand_partner",
  client: "client",
};

export function resolveUserTypeFromSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return SIGNUP_SLUG_TO_USER_TYPE[slug as SignupUserTypeSlug] ?? null;
}
