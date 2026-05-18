import { NextResponse } from "next/server";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string; staff_id: string } };

export async function PATCH(request: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("salon_staff")
    .update({
      role: body.role,
      commission_split: body.commission_split,
      booth_rent_amount: body.booth_rent_amount,
      booth_rent_frequency: body.booth_rent_frequency,
      status: body.status,
      can_set_own_prices: body.can_set_own_prices,
      can_take_own_bookings: body.can_take_own_bookings,
      calendar_color: body.calendar_color,
    })
    .eq("id", params.staff_id)
    .eq("salon_id", salon.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ staff: data });
}
