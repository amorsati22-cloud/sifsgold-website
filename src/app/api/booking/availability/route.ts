import { addDays, format, parseISO } from "date-fns";
import { NextResponse } from "next/server";
import {
  computeAvailableSlots,
  getAvailabilityCalendar,
} from "@/lib/booking/availability-engine";
import { fetchBlockedRanges, fetchProBookingContext } from "@/lib/booking/appointments";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get("pro_id");
  const date = searchParams.get("date");
  const serviceId = searchParams.get("service_id");
  const calendarDays = searchParams.get("calendar_days");

  if (!proId) {
    return NextResponse.json({ error: "pro_id required" }, { status: 400 });
  }

  const ctx = await fetchProBookingContext(proId);
  if (!ctx) {
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }

  if (ctx.rules.length === 0) {
    ctx.rules = [1, 2, 3, 4, 5].map((day_of_week) => ({
      id: `default-${day_of_week}`,
      pro_id: proId,
      day_of_week,
      start_time: "09:00:00",
      end_time: "17:00:00",
      timezone: ctx.pro.timezone,
      active: true,
      effective_from: null,
      effective_until: null,
    }));
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Booking unavailable" }, { status: 503 });
  }

  let durationMinutes = 60;
  if (serviceId) {
    const { data: service } = await admin
      .from("services")
      .select("duration_minutes, bookable_online")
      .eq("id", serviceId)
      .eq("pro_id", proId)
      .maybeSingle();
    if (!service?.bookable_online) {
      return NextResponse.json({ error: "Service not bookable" }, { status: 404 });
    }
    durationMinutes = (service.duration_minutes as number) || 60;
  }

  if (calendarDays) {
    const start = date ?? format(new Date(), "yyyy-MM-dd");
    const days = Math.min(60, Math.max(1, parseInt(calendarDays, 10) || 60));
    const rangeEnd = addDays(parseISO(start), days + 1).toISOString();
    const blocked = await fetchBlockedRanges(proId, parseISO(start).toISOString(), rangeEnd);

    const calendar = getAvailabilityCalendar(start, days, {
      proTimezone: ctx.pro.timezone,
      rules: ctx.rules,
      overrides: ctx.overrides,
      blocked,
      serviceDurationMinutes: durationMinutes,
      bufferMinutes: ctx.pro.booking_buffer_minutes,
    });

    return NextResponse.json({ calendar, timezone: ctx.pro.timezone });
  }

  if (!date) {
    return NextResponse.json({ error: "date required for slots" }, { status: 400 });
  }

  const dayStart = parseISO(date).toISOString();
  const dayEnd = addDays(parseISO(date), 1).toISOString();
  const blocked = await fetchBlockedRanges(proId, dayStart, dayEnd);

  const slots = computeAvailableSlots({
    date,
    proTimezone: ctx.pro.timezone,
    rules: ctx.rules,
    overrides: ctx.overrides,
    blocked,
    serviceDurationMinutes: durationMinutes,
    bufferMinutes: ctx.pro.booking_buffer_minutes,
  });

  return NextResponse.json({ slots, timezone: ctx.pro.timezone, date });
}
