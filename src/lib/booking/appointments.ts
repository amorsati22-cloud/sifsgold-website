import "server-only";

import { addMinutes, isAfter, parseISO } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Appointment, AppointmentStatus, AvailabilityOverride, AvailabilityRule } from "@/types/booking";
import type { BlockedRange } from "@/lib/booking/availability-engine";

const ACTIVE_STATUSES: AppointmentStatus[] = [
  "pending_confirmation",
  "confirmed",
  "in_progress",
];

export const RESERVATION_HOLD_MINUTES = 10;

export function reservationExpiry(): string {
  return addMinutes(new Date(), RESERVATION_HOLD_MINUTES).toISOString();
}

export async function fetchProBookingContext(proId: string) {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: pro } = await admin
    .from("pro_profiles")
    .select("id, username, display_name, timezone, booking_buffer_minutes")
    .eq("id", proId)
    .maybeSingle();

  if (!pro) return null;

  const [rulesRes, overridesRes] = await Promise.all([
    admin.from("availability_rules").select("*").eq("pro_id", proId).eq("active", true),
    admin.from("availability_overrides").select("*").eq("pro_id", proId),
  ]);

  return {
    pro: {
      id: pro.id as string,
      username: pro.username as string,
      display_name: pro.display_name as string,
      timezone: (pro.timezone as string) || "America/Chicago",
      booking_buffer_minutes: (pro.booking_buffer_minutes as number) ?? 15,
    },
    rules: (rulesRes.data ?? []) as AvailabilityRule[],
    overrides: (overridesRes.data ?? []) as AvailabilityOverride[],
  };
}

export async function fetchBlockedRanges(
  proId: string,
  rangeStart: string,
  rangeEnd: string,
): Promise<BlockedRange[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data } = await admin
    .from("appointments")
    .select("scheduled_start, scheduled_end, status, reserved_until")
    .eq("pro_id", proId)
    .in("status", ACTIVE_STATUSES)
    .lt("scheduled_start", rangeEnd)
    .gt("scheduled_end", rangeStart);

  const blocked: BlockedRange[] = [];

  for (const row of data ?? []) {
    const status = row.status as AppointmentStatus;
    if (status === "pending_confirmation") {
      const reservedUntil = row.reserved_until as string | null;
      if (reservedUntil && isAfter(parseISO(reservedUntil), new Date())) {
        blocked.push({
          start: parseISO(row.scheduled_start as string),
          end: parseISO(row.scheduled_end as string),
        });
      }
      continue;
    }
    blocked.push({
      start: parseISO(row.scheduled_start as string),
      end: parseISO(row.scheduled_end as string),
    });
  }

  return blocked;
}

export async function hasSchedulingConflict(
  proId: string,
  startIso: string,
  endIso: string,
  excludeAppointmentId?: string,
): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return true;

  let query = admin
    .from("appointments")
    .select("id, status, reserved_until")
    .eq("pro_id", proId)
    .in("status", ACTIVE_STATUSES)
    .lt("scheduled_start", endIso)
    .gt("scheduled_end", startIso);

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data } = await query;

  for (const row of data ?? []) {
    if (excludeAppointmentId && row.id === excludeAppointmentId) continue;
    const status = row.status as AppointmentStatus;
    if (status !== "pending_confirmation") return true;
    const reservedUntil = row.reserved_until as string | null;
    if (!reservedUntil || isAfter(parseISO(reservedUntil), new Date())) return true;
  }

  return false;
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("appointments").select("*").eq("id", id).maybeSingle();
  return (data as Appointment) ?? null;
}

export async function logStatusChange(input: {
  appointmentId: string;
  previousStatus: string | null;
  newStatus: string;
  changedBy?: string | null;
  note?: string;
}) {
  const admin = createAdminClient();
  if (!admin) return;
  await admin.from("appointment_status_history").insert({
    appointment_id: input.appointmentId,
    previous_status: input.previousStatus,
    new_status: input.newStatus,
    changed_by: input.changedBy ?? null,
    note: input.note ?? null,
  });
}

export async function getProAuthEmail(proId: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin.auth.admin.getUserById(proId);
  return data.user?.email ?? null;
}

export function bookingCents(amount: number): number {
  return Math.max(0, Math.round(amount * 100));
}
