import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  hasSchedulingConflict,
  logStatusChange,
  reservationExpiry,
} from "@/lib/booking/appointments";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  pro_id: string;
  service_id: string;
  scheduled_start: string;
  scheduled_end: string;
  addon_ids?: string[];
  timezone?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const { pro_id, service_id, scheduled_start, scheduled_end, addon_ids } = body;

  if (!pro_id || !service_id || !scheduled_start || !scheduled_end) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Booking unavailable" }, { status: 503 });
  }

  const { data: service } = await admin
    .from("services")
    .select("*")
    .eq("id", service_id)
    .eq("pro_id", pro_id)
    .eq("bookable_online", true)
    .maybeSingle();

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const conflict = await hasSchedulingConflict(pro_id, scheduled_start, scheduled_end);
  if (conflict) {
    return NextResponse.json({ error: "This time is no longer available" }, { status: 409 });
  }

  const { data: pro } = await admin
    .from("pro_profiles")
    .select("timezone")
    .eq("id", pro_id)
    .maybeSingle();

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  let addonTotal = 0;
  const addonIds = addon_ids ?? [];
  if (addonIds.length > 0) {
    const { data: addons } = await admin
      .from("service_addons")
      .select("id, price_amount")
      .eq("service_id", service_id)
      .in("id", addonIds);
    addonTotal = (addons ?? []).reduce((sum, a) => sum + Number(a.price_amount), 0);
  }

  const priceTotal = Number(service.price_amount) + addonTotal;
  const depositAmount =
    service.deposit_required && service.deposit_amount != null
      ? Number(service.deposit_amount)
      : 0;

  const reservationToken = randomUUID();
  const reservedUntil = reservationExpiry();

  const { data: appointment, error } = await admin
    .from("appointments")
    .insert({
      pro_id,
      client_id: user?.id ?? null,
      service_id,
      addon_ids: addonIds,
      scheduled_start,
      scheduled_end,
      timezone: body.timezone ?? (pro?.timezone as string) ?? "America/Chicago",
      status: "pending_confirmation",
      price_total: priceTotal,
      deposit_amount: depositAmount,
      created_via: "web",
      reserved_until: reservedUntil,
      reservation_token: reservationToken,
    })
    .select("id, reservation_token, reserved_until")
    .single();

  if (error || !appointment) {
    if (error?.code === "23505") {
      return NextResponse.json({ error: "This time is no longer available" }, { status: 409 });
    }
    return NextResponse.json({ error: error?.message ?? "Could not reserve" }, { status: 500 });
  }

  await logStatusChange({
    appointmentId: appointment.id as string,
    previousStatus: null,
    newStatus: "pending_confirmation",
    changedBy: user?.id ?? null,
    note: "Tentative reservation (10 min hold)",
  });

  return NextResponse.json({
    appointment_id: appointment.id,
    reservation_token: appointment.reservation_token,
    reserved_until: appointment.reserved_until,
    price_total: priceTotal,
    deposit_amount: depositAmount,
    deposit_required: depositAmount > 0,
  });
}
