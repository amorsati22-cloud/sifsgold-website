import { NextResponse } from "next/server";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data } = await supabase.from("salon_inventory").select("*").eq("salon_id", salon.id);
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("salon_inventory")
    .insert({ ...body, salon_id: salon.id })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
