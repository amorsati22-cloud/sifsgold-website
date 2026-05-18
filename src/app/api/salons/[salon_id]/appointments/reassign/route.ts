import { NextResponse } from "next/server";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function POST(request: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const appointmentId = body.appointment_id as string;
  const newProId = body.new_pro_id as string;

  if (!appointmentId || !newProId) {
    return NextResponse.json({ error: "appointment_id and new_pro_id required" }, { status: 400 });
  }

  const { data: staff } = await supabase
    .from("salon_staff")
    .select("pro_id")
    .eq("salon_id", salon.id)
    .eq("pro_id", newProId)
    .eq("status", "active")
    .maybeSingle();

  if (!staff) return NextResponse.json({ error: "Pro not on team" }, { status: 400 });

  const admin = createAdminClient() ?? supabase;
  const { data, error } = await admin
    .from("appointments")
    .update({ pro_id: newProId, salon_id: salon.id })
    .eq("id", appointmentId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ appointment: data, notified: true });
}
