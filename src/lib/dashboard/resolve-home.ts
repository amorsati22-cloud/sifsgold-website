import "server-only";

import { getDashboardHomePath } from "@/lib/dashboard/routing";
import { createClient } from "@/lib/supabase/server";

export async function resolveDashboardHomePath(
  userId: string,
  userType: string | null | undefined,
): Promise<string> {
  const supabase = await createClient();
  if (supabase) {
    const { data: enrolled } = await supabase
      .from("students")
      .select("id")
      .eq("id", userId)
      .eq("status", "enrolled")
      .maybeSingle();
    if (enrolled) return "/dashboard/student/home";
  }
  return getDashboardHomePath(userType);
}
