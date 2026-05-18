import { NextResponse } from "next/server";
import { encryptEin } from "@/lib/salons/ein-crypto";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function PATCH(request: Request, { params }: Ctx) {
  const { salon, user, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const updates: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() };
  delete updates.ein;

  if (body.ein && typeof body.ein === "string") {
    const enc = encryptEin(body.ein, user.id);
    updates.encrypted_ein = enc.encrypted_ein;
    updates.ein_iv = enc.ein_iv;
  }

  const { data, error } = await supabase
    .from("salons")
    .update(updates)
    .eq("id", salon.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ salon: data });
}
