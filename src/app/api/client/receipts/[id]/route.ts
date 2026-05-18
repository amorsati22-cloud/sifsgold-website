import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: appt } = await supabase
    .from("appointments")
    .select("*, services(name), pro_profiles(display_name)")
    .eq("id", params.id)
    .or(`client_id.eq.${user.id},guest_email.eq.${user.email ?? ""}`)
    .maybeSingle();

  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const service = appt.services as { name: string } | null;
  const pro = appt.pro_profiles as { display_name: string } | null;
  const lines = [
    "Sif's Gold — Appointment Receipt",
    "",
    `Service: ${service?.name ?? "Appointment"}`,
    `Professional: ${pro?.display_name ?? ""}`,
    `Date: ${appt.scheduled_start}`,
    `Status: ${appt.status}`,
    `Deposit paid: $${Number(appt.deposit_amount).toFixed(2)}`,
    `Total: $${Number(appt.price_total).toFixed(2)}`,
    "",
    "Thank you for booking with Sif's Gold.",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="receipt-${params.id.slice(0, 8)}.txt"`,
    },
  });
}
