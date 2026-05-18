"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Appointment, AppointmentStatus } from "@/types/booking";

type Props = {
  proId: string;
  timezone: string;
  initialAppointments: Appointment[];
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending_confirmation: "border-amber-400/60 bg-amber-950/40",
  confirmed: "border-gold/50 bg-gold/10",
  in_progress: "border-sky-400/50 bg-sky-950/30",
  completed: "border-cream/20 bg-navy/60",
  cancelled_by_client: "border-red-500/30 bg-red-950/20 opacity-60",
  cancelled_by_pro: "border-red-500/30 bg-red-950/20 opacity-60",
  no_show: "border-red-500/30 bg-red-950/20 opacity-60",
};

type ViewMode = "week" | "month" | "day";

export function ProCalendar({ proId, timezone, initialAppointments }: Props) {
  const [view, setView] = useState<ViewMode>("week");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const from = addDays(weekStart, -7).toISOString();
    const to = addDays(weekStart, 21).toISOString();
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("pro_id", proId)
      .gte("scheduled_start", from)
      .lte("scheduled_start", to)
      .order("scheduled_start", { ascending: true });
    setAppointments((data as Appointment[]) ?? []);
  }, [proId, weekStart]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`pro-appointments-${proId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `pro_id=eq.${proId}`,
        },
        () => {
          void refresh();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [proId, refresh]);

  const days = useMemo(() => {
    const count = view === "month" ? 28 : view === "day" ? 1 : 7;
    return Array.from({ length: count }, (_, i) => addDays(view === "day" ? new Date() : weekStart, i));
  }, [view, weekStart]);

  function appointmentsForDay(day: Date) {
    const key = format(day, "yyyy-MM-dd");
    return appointments.filter((a) => format(parseISO(a.scheduled_start), "yyyy-MM-dd") === key);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {(["week", "month", "day"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 font-body text-sm capitalize focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy ${
              view === v ? "bg-gold/20 text-gold" : "text-gold-body hover:text-gold"
            }`}
          >
            {v}
          </button>
        ))}
        <GoldButton
          label="← Prev"
          onClick={() => setWeekStart((d) => addDays(d, view === "month" ? -28 : -7))}
          variant="ghost"
          size="sm"
        />
        <GoldButton
          label="Next →"
          onClick={() => setWeekStart((d) => addDays(d, view === "month" ? 28 : 7))}
          variant="ghost"
          size="sm"
        />
        <span className="font-body text-sm text-cream/70">{timezone.replace(/_/g, " ")}</span>
      </div>

      <div
        className={`grid gap-3 ${view === "day" ? "grid-cols-1" : view === "week" ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        {days.map((day) => (
          <div key={day.toISOString()} className="min-h-[120px] rounded-brand-lg border border-gold/10 bg-navy/40 p-2">
            <p className="mb-2 font-body text-xs font-semibold text-gold">{format(day, "EEE d")}</p>
            <ul className="space-y-1">
              {appointmentsForDay(day).map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(a)}
                    className={`w-full rounded border px-2 py-1 text-left font-body text-xs text-cream focus:outline-none focus:ring-2 focus:ring-gold ${STATUS_COLORS[a.status]}`}
                  >
                    {formatInTimeZone(parseISO(a.scheduled_start), timezone, "h:mm a")} · {a.status.replace(/_/g, " ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selected ? (
        <dialog open className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-md rounded-brand-lg border border-gold/20 bg-navy p-6 shadow-xl">
            <h3 className="font-heading text-lg text-gold">Appointment</h3>
            <p className="mt-2 font-body text-sm text-cream">
              {formatInTimeZone(parseISO(selected.scheduled_start), timezone, "PPpp")}
            </p>
            <p className="mt-1 font-body text-sm text-gold-body">Status: {selected.status}</p>
            {selected.guest_name ? (
              <p className="mt-1 font-body text-sm text-cream/80">Client: {selected.guest_name}</p>
            ) : null}
            {selected.client_notes ? (
              <p className="mt-2 font-body text-sm text-gold-body">{selected.client_notes}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <GoldButton label="Close" onClick={() => setSelected(null)} variant="outlined" size="sm" />
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
