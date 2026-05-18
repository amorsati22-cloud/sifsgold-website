import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDashboardHomePath } from "@/lib/dashboard/routing";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in?next=/dashboard");
  }

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in?next=/dashboard");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  redirect(getDashboardHomePath(profile?.user_type as string | undefined));
}
