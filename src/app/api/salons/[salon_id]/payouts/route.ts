import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { calculateStaffPayouts, getSalonPayoutHistory } from "@/lib/salons/data";
import { executeSalonPayouts } from "@/lib/salons/payouts";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const { salon } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const periodEnd = new Date();
  const periodStart = subDays(periodEnd, 7);
  const lines = await calculateStaffPayouts(salon.id, periodStart, periodEnd);
  const history = await getSalonPayoutHistory(salon.id);

  return NextResponse.json({
    period_start: periodStart.toISOString().slice(0, 10),
    period_end: periodEnd.toISOString().slice(0, 10),
    lines,
    history,
  });
}

export async function POST(request: Request, { params }: Ctx) {
  const { salon } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const periodStart = new Date(body.period_start ?? subDays(new Date(), 7));
  const periodEnd = new Date(body.period_end ?? new Date());
  const lines = body.lines ?? (await calculateStaffPayouts(salon.id, periodStart, periodEnd));

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server configuration required for payouts" }, { status: 503 });
  }

  const result = await executeSalonPayouts(admin, {
    salonId: salon.id,
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    lines,
  });

  return NextResponse.json(result);
}
