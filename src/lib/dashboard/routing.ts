import "server-only";

import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";

export function getDashboardHomePath(userType: string | null | undefined): string {
  if (userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number])) {
    return "/dashboard/pro/home";
  }
  if (userType && BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number])) {
    return "/dashboard/brand-deals";
  }
  if (userType && ADVOCATE_USER_TYPES.includes(userType as (typeof ADVOCATE_USER_TYPES)[number])) {
    return "/dashboard/advocate/brand-deals";
  }
  return "/dashboard/home";
}
