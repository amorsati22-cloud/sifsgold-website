import { NextResponse } from "next/server";
import { sendCohortMassEmail } from "@/lib/schools/communications";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: { school_id: string; cohort_id: string } };

export async function POST(request: Request, { params }: Ctx) {
  const { school, user, supabase } = await requireSchoolDashboardUser();
  if (school.id !== params.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data: students } = await supabase
    .from("students")
    .select("id, profiles(email, full_name)")
    .eq("cohort_id", params.cohort_id)
    .eq("status", "enrolled");

  const recipients = (students ?? [])
    .map((s) => {
      const p = s.profiles as { email: string; full_name: string } | null;
      return p?.email ? { email: p.email, name: p.full_name ?? "Student" } : null;
    })
    .filter(Boolean) as { email: string; name: string }[];

  const admin = createAdminClient() ?? supabase;
  const result = await sendCohortMassEmail(admin, {
    schoolId: school.id,
    cohortId: params.cohort_id,
    sentBy: user.id,
    subject: body.subject,
    body: body.body,
    recipients,
    schoolName: school.name,
  });

  return NextResponse.json(result);
}
