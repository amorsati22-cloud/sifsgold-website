import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import type { ProAppointmentWithClient } from "@/types/pro-ops";

const STATUS_STYLES: Record<string, string> = {
  pending_confirmation: "border-amber-400/50 text-amber-200",
  confirmed: "border-gold/40 text-gold",
  in_progress: "border-sky-400/40 text-sky-200",
  completed: "border-cream/20 text-cream/60",
};

export function ProTodayTimeline({
  appointments,
  timezone,
}: {
  appointments: ProAppointmentWithClient[];
  timezone: string;
}) {
  if (appointments.length === 0) {
    return <p className="font-body text-sm text-gold-body">No appointments on today&apos;s calendar.</p>;
  }

  return (
    <ol className="relative space-y-0 border-l border-gold/20 pl-6">
      {appointments.map((a) => (
        <li key={a.id} className="relative pb-6 last:pb-0">
          <span
            className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-gold bg-navy"
            aria-hidden
          />
          <Link
            href={`/booking/${a.id}`}
            className="block rounded-brand-lg border border-gold/10 bg-navy/40 p-4 transition hover:border-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <p className="font-body text-sm text-gold">
              {formatInTimeZone(parseISO(a.scheduled_start), timezone, "h:mm a")} –{" "}
              {formatInTimeZone(parseISO(a.scheduled_end), timezone, "h:mm a")}
            </p>
            <p className="mt-1 font-heading text-cream">{a.service_name ?? "Appointment"}</p>
            <p className="font-body text-sm text-gold-body">{a.client_name}</p>
            <span
              className={`mt-2 inline-block rounded-full border px-2 py-0.5 font-body text-xs capitalize ${STATUS_STYLES[a.status] ?? ""}`}
            >
              {a.status.replace(/_/g, " ")}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
