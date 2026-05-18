import { NextResponse } from "next/server";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string; item_id: string } };

export async function PATCH(request: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("salon_inventory")
    .update(body)
    .eq("id", params.item_id)
    .eq("salon_id", salon.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.quantity_delta) {
    await supabase.from("salon_inventory_usage").insert({
      inventory_id: params.item_id,
      salon_id: salon.id,
      quantity_used: Math.abs(Number(body.quantity_delta)),
      note: body.usage_note ?? "Adjustment",
    });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase
    .from("salon_inventory")
    .delete()
    .eq("id", params.item_id)
    .eq("salon_id", salon.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
