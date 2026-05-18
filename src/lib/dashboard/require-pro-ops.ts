import "server-only";

import { redirect } from "next/navigation";
import { requireProDashboardUser } from "@/lib/dashboard";

export async function requireProOpsUser() {
  return requireProDashboardUser();
}
