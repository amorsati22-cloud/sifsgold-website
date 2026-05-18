import { NextResponse } from "next/server";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: { school_id: string } };

export async function POST(request: Request, { params }: Ctx) {
  const { school, supabase } = await requireSchoolDashboardUser();
  if (school.id !== params.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const profileId = body.profile_id as string;
  if (!profileId) return NextResponse.json({ error: "profile_id required" }, { status: 400 });

  const admin = createAdminClient() ?? supabase;
  const { data, error } = await admin
    .from("students")
    .upsert({
      id: profileId,
      cohort_id: body.cohort_id,
      school_id: school.id,
      enrollment_date: body.enrollment_date ?? new Date().toISOString().slice(0, 10),
      expected_graduation: body.expected_graduation,
      status: "enrolled",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ student: data });
}
