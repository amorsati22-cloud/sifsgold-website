import { NextResponse } from "next/server";
import { getSalonAppointments } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function GET(request: Request, { params }: Ctx) {
  const { salon } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const from = new Date(searchParams.get("from") ?? Date.now());
  const to = new Date(searchParams.get("to") ?? Date.now());

  const appointments = await getSalonAppointments(salon.id, from, to);
  return NextResponse.json({ appointments });
}
