import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { ProAppointmentWithClient } from "@/types/pro-ops";

export function ProWeekPreview({
  appointments,
  timezone,
}: {
  appointments: ProAppointmentWithClient[];
  timezone: string;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="grid gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const dayAppts = appointments.filter(
          (a) => format(parseISO(a.scheduled_start), "yyyy-MM-dd") === key,
        );
        return (
          <div
            key={key}
            className="min-h-[80px] rounded-brand-md border border-gold/10 bg-navy/40 p-2"
          >
            <p className="font-body text-xs font-semibold text-gold">{format(day, "EEE d")}</p>
            <ul className="mt-1 space-y-1">
              {dayAppts.slice(0, 2).map((a) => (
                <li key={a.id} className="truncate font-body text-[10px] text-cream/80">
                  {formatInTimeZone(parseISO(a.scheduled_start), timezone, "h:mm a")} {a.client_name}
                </li>
              ))}
              {dayAppts.length > 2 ? (
                <li className="font-body text-[10px] text-gold-body">+{dayAppts.length - 2} more</li>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
