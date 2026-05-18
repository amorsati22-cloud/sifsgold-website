import { NextResponse } from "next/server";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";
import { getSyllabusTemplate } from "@/lib/schools/syllabus-templates";

export const runtime = "nodejs";

type Ctx = { params: { school_id: string } };

export async function POST(request: Request, { params }: Ctx) {
  const { school, supabase } = await requireSchoolDashboardUser();
  if (school.id !== params.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data: cohort, error } = await supabase
    .from("cohorts")
    .insert({
      school_id: school.id,
      name: body.name,
      program_type: body.program_type ?? "cosmetology",
      state: body.state ?? school.state,
      required_hours: body.required_hours ?? 1500,
      start_date: body.start_date,
      expected_end_date: body.expected_end_date,
    })
    .select("*")
    .single();

  if (error || !cohort) return NextResponse.json({ error: error?.message }, { status: 500 });

  if (body.apply_template !== false) {
    const modules = getSyllabusTemplate(
      cohort.state as string,
      cohort.program_type as "cosmetology",
      Number(cohort.required_hours),
    );
    await supabase.from("syllabus_modules").insert(
      modules.map((m) => ({ ...m, cohort_id: cohort.id })),
    );
  }

  return NextResponse.json({ cohort });
}
