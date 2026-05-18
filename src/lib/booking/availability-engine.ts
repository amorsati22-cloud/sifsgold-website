import {
  addDays,
  addMinutes,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import type { AvailabilityOverride, AvailabilityRule, TimeSlot } from "@/types/booking";

export type BlockedRange = {
  start: Date;
  end: Date;
};

export type ComputeSlotsInput = {
  date: string;
  proTimezone: string;
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  blocked: BlockedRange[];
  serviceDurationMinutes: number;
  slotIncrementMinutes?: number;
  bufferMinutes?: number;
  now?: Date;
};

function parseTimeOnDate(dateStr: string, timeStr: string, tz: string): Date {
  const localIso = `${dateStr}T${timeStr.length === 5 ? `${timeStr}:00` : timeStr}`;
  return fromZonedTime(localIso, tz);
}

function ruleApplies(rule: AvailabilityRule, dateStr: string): boolean {
  if (!rule.active) return false;
  const d = parseISO(dateStr);
  if (rule.effective_from && dateStr < rule.effective_from) return false;
  if (rule.effective_until && dateStr > rule.effective_until) return false;
  const dow = d.getDay();
  return rule.day_of_week === dow;
}

function getWorkingWindows(
  dateStr: string,
  rules: AvailabilityRule[],
  overrides: AvailabilityOverride[],
  proTimezone: string,
): { start: Date; end: Date }[] {
  const dayOverride = overrides.find((o) => o.override_date === dateStr);
  if (dayOverride?.type === "unavailable" || dayOverride?.type === "vacation" || dayOverride?.type === "holiday") {
    return [];
  }

  if (dayOverride?.type === "custom_hours" && dayOverride.start_time && dayOverride.end_time) {
    return [
      {
        start: parseTimeOnDate(dateStr, dayOverride.start_time, proTimezone),
        end: parseTimeOnDate(dateStr, dayOverride.end_time, proTimezone),
      },
    ];
  }

  const windows: { start: Date; end: Date }[] = [];
  for (const rule of rules) {
    if (!ruleApplies(rule, dateStr)) continue;
    const tz = rule.timezone || proTimezone;
    windows.push({
      start: parseTimeOnDate(dateStr, rule.start_time, tz),
      end: parseTimeOnDate(dateStr, rule.end_time, tz),
    });
  }
  return windows;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return isBefore(aStart, bEnd) && isAfter(aEnd, bStart);
}

export function computeAvailableSlots(input: ComputeSlotsInput): TimeSlot[] {
  const {
    date,
    proTimezone,
    rules,
    overrides,
    blocked,
    serviceDurationMinutes,
    slotIncrementMinutes = 15,
    bufferMinutes = 0,
    now = new Date(),
  } = input;

  const windows = getWorkingWindows(date, rules, overrides, proTimezone);
  if (windows.length === 0) return [];

  const slots: TimeSlot[] = [];
  const duration = serviceDurationMinutes + bufferMinutes;

  for (const window of windows) {
    let cursor = window.start;
    while (addMinutes(cursor, duration) <= window.end) {
      const slotEnd = addMinutes(cursor, duration);
      const blockedSlot = blocked.some((b) => overlaps(cursor, slotEnd, b.start, b.end));
      const inPast = isBefore(slotEnd, now);

      if (!blockedSlot && !inPast) {
        slots.push({
          start: cursor.toISOString(),
          end: slotEnd.toISOString(),
          timezone: proTimezone,
        });
      }
      cursor = addMinutes(cursor, slotIncrementMinutes);
    }
  }

  return slots;
}

export function dateHasAvailability(input: Omit<ComputeSlotsInput, "date"> & { date: string }): boolean {
  return computeAvailableSlots(input).length > 0;
}

export function getAvailabilityCalendar(
  startDate: string,
  days: number,
  base: Omit<ComputeSlotsInput, "date" | "now">,
): { date: string; hasSlots: boolean }[] {
  const out: { date: string; hasSlots: boolean }[] = [];
  let d = parseISO(startDate);
  const end = addDays(d, days);
  const now = new Date();

  while (isBefore(d, end) || isEqual(d, end)) {
    const dateStr = format(d, "yyyy-MM-dd");
    const hasSlots = dateHasAvailability({ ...base, date: dateStr, now });
    out.push({ date: dateStr, hasSlots });
    d = addDays(d, 1);
  }
  return out;
}

export function formatSlotForDisplay(iso: string, displayTimezone: string): string {
  const zoned = toZonedTime(parseISO(iso), displayTimezone);
  return format(zoned, "h:mm a");
}

export function formatAppointmentRange(
  startIso: string,
  endIso: string,
  displayTimezone: string,
): string {
  const start = toZonedTime(parseISO(startIso), displayTimezone);
  const end = toZonedTime(parseISO(endIso), displayTimezone);
  return `${format(start, "EEE, MMM d · h:mm a")} – ${format(end, "h:mm a zzz")}`;
}

export { startOfDay };
