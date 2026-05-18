import { NextResponse } from "next/server";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const runtime = "nodejs";

type Ctx = { params: { school_id: string; log_id: string } };

export async function POST(_req: Request, { params }: Ctx) {
  const { school, supabase } = await requireSchoolDashboardUser();
  if (school.id !== params.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("hour_logs")
    .update({ approved: true, approved_at: new Date().toISOString() })
    .eq("id", params.log_id)
    .eq("school_id", school.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}
