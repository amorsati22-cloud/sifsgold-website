import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolveDashboardHomePath } from "@/lib/dashboard/resolve-home";
import { getServerSession } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in?next=/dashboard");
  }

  const { user } = await getServerSession();
  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    ?.from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle() ?? { data: null };

  const home = await resolveDashboardHomePath(user.id, profile?.user_type);
  if (home !== "/dashboard/home") {
    redirect(home);
  }

  const { DashboardWelcome } = await import("@/components/auth/DashboardWelcome");
  return <DashboardWelcome email={user.email ?? "member"} />;
}
