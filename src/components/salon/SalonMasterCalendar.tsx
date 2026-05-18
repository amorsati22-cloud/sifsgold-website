"use client";

import { useCallback, useMemo, useState } from "react";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { SalonAppointment, SalonStaff } from "@/types/salon";

type Props = {
  salonId: string;
  timezone: string;
  staff: SalonStaff[];
  initialAppointments: SalonAppointment[];
};

export function SalonMasterCalendar({ salonId, timezone, staff, initialAppointments }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [dragId, setDragId] = useState<string | null>(null);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const staffOptions = staff.filter((s) => s.status === "active");

  const refresh = useCallback(async () => {
    const from = addDays(weekStart, -1).toISOString();
    const to = addDays(weekStart, 8).toISOString();
    const res = await fetch(`/api/salons/${salonId}/schedule?from=${from}&to=${to}`);
    if (res.ok) {
      const data = await res.json();
      setAppointments(data.appointments ?? []);
    }
  }, [salonId, weekStart]);

  async function reassign(appointmentId: string, newProId: string) {
    await fetch(`/api/salons/${salonId}/appointments/reassign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id: appointmentId, new_pro_id: newProId }),
    });
    void refresh();
  }

  function apptsForDay(day: Date) {
    const key = format(day, "yyyy-MM-dd");
    return appointments.filter((a) => format(parseISO(a.scheduled_start), "yyyy-MM-dd") === key);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, -7))}
          className="rounded-brand-sm border border-gold/20 px-3 py-1 font-body text-sm text-gold"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, 7))}
          className="rounded-brand-sm border border-gold/20 px-3 py-1 font-body text-sm text-gold"
        >
          Next →
        </button>
        <ul className="ml-auto flex flex-wrap gap-3">
          {staffOptions.map((s) => (
            <li key={s.id} className="flex items-center gap-1 font-body text-xs text-gold-body">
              <span className="h-2 w-2 rounded-full" style={{ background: s.calendar_color ?? "#D4A843" }} />
              {s.display_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2 md:grid-cols-7">
        {days.map((day) => (
          <div key={day.toISOString()} className="min-h-[120px] rounded-brand-md border border-gold/15 p-2">
            <p className="mb-2 font-body text-xs font-medium text-gold">{format(day, "EEE M/d")}</p>
            <ul className="space-y-1">
              {apptsForDay(day).map((a) => (
                <li
                  key={a.id}
                  draggable
                  onDragStart={() => setDragId(a.id)}
                  className="cursor-grab rounded px-1 py-1 font-body text-[10px] text-navy"
                  style={{ backgroundColor: a.staff_color }}
                >
                  <span className="font-medium">{a.staff_name}</span>
                  <br />
                  {formatInTimeZone(parseISO(a.scheduled_start), timezone, "h:mm a")} · {a.client_name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {dragId ? (
        <div className="rounded-brand-lg border border-gold/20 bg-navy/60 p-4">
          <p className="mb-2 font-body text-sm text-gold">Reassign to:</p>
          <div className="flex flex-wrap gap-2">
            {staffOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  void reassign(dragId, s.pro_id);
                  setDragId(null);
                }}
                className="rounded-brand-sm border border-gold/30 px-3 py-1 font-body text-xs text-cream hover:bg-gold/10"
              >
                {s.display_name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDragId(null)}
              className="font-body text-xs text-gold-body"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
