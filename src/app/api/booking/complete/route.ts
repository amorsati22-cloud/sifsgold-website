import { NextResponse } from "next/server";
import { logStatusChange } from "@/lib/booking/appointments";
import { awardLoyaltyForAppointment } from "@/lib/loyalty/integrations";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { appointment_id: string };

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: appointment } = await admin
    .from("appointments")
    .select("id, pro_id, status")
    .eq("id", body.appointment_id)
    .maybeSingle();

  if (!appointment || appointment.pro_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const previous = appointment.status as string;
  const now = new Date().toISOString();

  await admin
    .from("appointments")
    .update({ status: "completed", completed_at: now })
    .eq("id", body.appointment_id);

  await logStatusChange({
    appointmentId: body.appointment_id,
    previousStatus: previous,
    newStatus: "completed",
    changedBy: user.id,
    note: "Marked completed",
  });

  await awardLoyaltyForAppointment(body.appointment_id);

  return NextResponse.json({ ok: true, appointment_id: body.appointment_id, status: "completed" });
}
