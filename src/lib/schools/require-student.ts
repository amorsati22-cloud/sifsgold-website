import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Cohort, School, SchoolStudent } from "@/types/school";

export async function requireEnrolledStudent(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  user: { id: string; email?: string };
  student: SchoolStudent;
  cohort: Cohort;
  school: School;
}> {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard/student/home");

  const { data: student } = await supabase
    .from("students")
    .select("*, cohort:cohorts(*), school:schools(*)")
    .eq("id", user.id)
    .maybeSingle();

  if (!student || student.status !== "enrolled") {
    redirect("/dashboard/home");
  }

  const cohortRaw = student.cohort as Cohort | Cohort[] | null;
  const schoolRaw = student.school as School | School[] | null;
  const cohort = (Array.isArray(cohortRaw) ? cohortRaw[0] : cohortRaw) as Cohort;
  const school = (Array.isArray(schoolRaw) ? schoolRaw[0] : schoolRaw) as School;

  return {
    supabase,
    user,
    student: student as SchoolStudent,
    cohort,
    school,
  };
}
