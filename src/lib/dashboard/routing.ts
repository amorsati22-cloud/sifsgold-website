import "server-only";

import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { isSalonUserType } from "@/lib/auth-salon";
import { isSchoolUserType } from "@/lib/auth-school";

export function getDashboardHomePath(userType: string | null | undefined): string {
  if (isSchoolUserType(userType)) {
    return "/dashboard/school/home";
  }
  if (isSalonUserType(userType)) {
    return "/dashboard/salon/home";
  }
  if (userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number])) {
    return "/dashboard/pro/home";
  }
  if (userType && BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number])) {
    return "/dashboard/brand-deals";
  }
  if (userType && ADVOCATE_USER_TYPES.includes(userType as (typeof ADVOCATE_USER_TYPES)[number])) {
    return "/dashboard/advocate";
  }
  return "/dashboard/home";
}
