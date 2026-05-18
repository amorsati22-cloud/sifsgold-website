import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardWelcome } from "@/components/auth/DashboardWelcome";
import { getServerSession } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

  return <DashboardWelcome email={user.email ?? "member"} />;
}
