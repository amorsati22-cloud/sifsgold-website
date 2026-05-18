import "server-only";

import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { CLIENT_DASHBOARD_NAV } from "@/lib/client-dashboard/nav";
import { PRO_OPS_NAV } from "@/lib/pro-ops/nav";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { isSalonUserType } from "@/lib/auth-salon";
import { isSchoolUserType } from "@/lib/auth-school";
import { SALON_DASHBOARD_NAV } from "@/lib/salons/nav";
import { SCHOOL_DASHBOARD_NAV } from "@/lib/schools/nav";

export type DashboardNavItem = { href: string; label: string; badge?: string };

export function getDashboardNavForUserType(userType: string | null | undefined): DashboardNavItem[] {
  if (isSchoolUserType(userType)) {
    return [...SCHOOL_DASHBOARD_NAV];
  }
  if (isSalonUserType(userType)) {
    return [...SALON_DASHBOARD_NAV];
  }
  if (userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number])) {
    return [...PRO_OPS_NAV];
  }

  if (userType && BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number])) {
    return [
      { href: "/dashboard/brand-deals", label: "Brand deals" },
      { href: "/dashboard/storefront", label: "Storefront" },
    ];
  }

  if (userType && ADVOCATE_USER_TYPES.includes(userType as (typeof ADVOCATE_USER_TYPES)[number])) {
    return [
      { href: "/dashboard/advocate", label: "Advocate hub" },
      { href: "/brand-deals/marketplace", label: "Marketplace" },
    ];
  }

  return [...CLIENT_DASHBOARD_NAV];
}
