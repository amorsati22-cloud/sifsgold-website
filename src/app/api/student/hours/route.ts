import { NextResponse } from "next/server";
import { requireEnrolledStudent } from "@/lib/schools/require-student";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { student, school, supabase } = await requireEnrolledStudent();
  const body = await request.json();

  const { data, error } = await supabase
    .from("hour_logs")
    .insert({
      student_id: student.id,
      school_id: school.id,
      module_id: body.module_id,
      hours: body.hours,
      activity: body.activity ?? "salon_clinic",
      service_performed: body.service_performed,
      approved: false,
      photo_evidence_url: body.photo_evidence_url,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}
