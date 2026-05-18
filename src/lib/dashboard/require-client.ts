import "server-only";

import { redirect } from "next/navigation";
import { getDashboardHomePath } from "@/lib/dashboard/routing";
import { requireClientSession } from "@/lib/client-dashboard/data";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import { BRAND_USER_TYPES } from "@/lib/auth-brand";
import { ADVOCATE_USER_TYPES } from "@/lib/auth-advocate";

export async function requireClientDashboardUser() {
  const session = await requireClientSession();
  if (!session) redirect("/sign-in?next=/dashboard/home");

  const userType = session.profile?.user_type as string | undefined;
  if (
    userType &&
    (PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number]) ||
      BRAND_USER_TYPES.includes(userType as (typeof BRAND_USER_TYPES)[number]) ||
      ADVOCATE_USER_TYPES.includes(userType as (typeof ADVOCATE_USER_TYPES)[number]))
  ) {
    redirect(getDashboardHomePath(userType));
  }

  return session;
}
