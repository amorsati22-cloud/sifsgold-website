import Link from "next/link";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { ClientAppointmentRow } from "@/types/client-dashboard";

const STATUS_LABEL: Record<string, string> = {
  pending_confirmation: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled_by_client: "Cancelled",
  cancelled_by_pro: "Cancelled",
  no_show: "No show",
};

type Props = { appointment: ClientAppointmentRow; timezone?: string };

export function AppointmentCard({ appointment, timezone }: Props) {
  const tz = timezone ?? "America/Chicago";
  const when = formatInTimeZone(parseISO(appointment.scheduled_start), tz, "EEE, MMM d · h:mm a");
  const paid =
    appointment.deposit_paid && appointment.deposit_amount > 0
      ? appointment.deposit_amount
      : appointment.final_paid
        ? appointment.price_total
        : 0;

  return (
    <Link
      href={`/booking/${appointment.id}`}
      className="block rounded-brand-lg border border-gold/15 bg-navy/50 p-4 transition hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-heading text-cream">{appointment.service_name ?? "Appointment"}</p>
          {appointment.pro ? (
            <p className="mt-1 font-body text-sm text-gold-body">with {appointment.pro.display_name}</p>
          ) : null}
          <p className="mt-2 font-body text-sm text-gold">{when}</p>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full border border-gold/25 px-2 py-0.5 font-body text-xs text-gold">
            {STATUS_LABEL[appointment.status] ?? appointment.status}
          </span>
          {paid > 0 ? (
            <p className="mt-2 font-body text-sm text-cream">${paid.toFixed(2)} paid</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
