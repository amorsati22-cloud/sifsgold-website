import { NextResponse } from "next/server";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const runtime = "nodejs";

type Ctx = { params: { school_id: string } };

export async function POST(request: Request, { params }: Ctx) {
  const { school, supabase, user } = await requireSchoolDashboardUser();
  if (school.id !== params.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  if (body.bulk && Array.isArray(body.entries)) {
    const rows = body.entries.map((e: { student_id: string; hours: number; module_id?: string; activity?: string }) => ({
      student_id: e.student_id,
      school_id: school.id,
      module_id: e.module_id ?? null,
      hours: e.hours,
      activity: e.activity ?? "theory_lecture",
      instructor_id: user.id,
      approved: true,
      approved_at: new Date().toISOString(),
    }));
    const { data, error } = await supabase.from("hour_logs").insert(rows).select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ logs: data });
  }

  const { data, error } = await supabase
    .from("hour_logs")
    .insert({
      student_id: body.student_id,
      school_id: school.id,
      module_id: body.module_id,
      hours: body.hours,
      activity: body.activity ?? "theory_lecture",
      service_performed: body.service_performed,
      instructor_id: body.instructor_id ?? user.id,
      approved: body.approved ?? false,
      photo_evidence_url: body.photo_evidence_url,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}
