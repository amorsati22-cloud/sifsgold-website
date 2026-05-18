import "server-only";

import { redirect } from "next/navigation";
import { isSchoolUserType } from "@/lib/auth-school";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { School } from "@/types/school";

export async function requireSchoolDashboardUser(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  user: { id: string; email?: string };
  school: School;
}> {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard/school/home");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.user_type || !isSchoolUserType(profile.user_type)) {
    redirect("/for-schools");
  }

  let { data: school } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!school) {
    const slug = `school-${user.id.slice(0, 8)}`;
    const { data: created } = await supabase
      .from("schools")
      .insert({
        owner_id: user.id,
        name: "My Beauty School",
        state: "TX",
        slug,
        subscription_tier: "school-free",
      })
      .select("*")
      .single();
    school = created;
  }

  if (!school) redirect("/dashboard/school/settings");

  return { supabase, user, school: school as School };
}
