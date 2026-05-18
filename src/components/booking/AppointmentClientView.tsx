"use client";

import { useEffect, useMemo, useState } from "react";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Appointment, AppointmentStatus } from "@/types/booking";

type Props = {
  appointment: Appointment & {
    service_name?: string;
    pro_display_name?: string;
    pro_username?: string;
    cancellation_policy?: string | null;
  };
  canCancel: boolean;
  cancelMessage: string;
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending_confirmation: "Pending confirmation",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled_by_client: "Cancelled",
  cancelled_by_pro: "Cancelled by professional",
  no_show: "No show",
};

export function AppointmentClientView({ appointment, canCancel, cancelMessage }: Props) {
  const clientTz = useMemo(
    () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : appointment.timezone),
    [appointment.timezone],
  );
  const [status, setStatus] = useState(appointment.status);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`appointment-${appointment.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "appointments",
          filter: `id=eq.${appointment.id}`,
        },
        (payload) => {
          const next = payload.new as { status?: AppointmentStatus };
          if (next.status) setStatus(next.status);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [appointment.id]);

  async function handleCancel() {
    if (!canCancel) return;
    setCancelling(true);
    setError(null);
    const res = await fetch("/api/booking/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id: appointment.id, reason: "Client requested" }),
    });
    const data = await res.json();
    setCancelling(false);
    if (!res.ok) {
      setError(data.error ?? "Could not cancel");
      return;
    }
    setStatus(data.status);
  }

  const when = formatInTimeZone(
    parseISO(appointment.scheduled_start),
    clientTz,
    "EEEE, MMMM d · h:mm a zzz",
  );

  const isCancelled = status.startsWith("cancelled");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="font-body text-sm text-gold-body">
        Status: <span className="text-gold">{STATUS_LABELS[status] ?? status}</span>
      </p>
      <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-6">
        <h2 className="font-heading text-xl text-cream">{appointment.service_name ?? "Appointment"}</h2>
        <p className="mt-2 font-body text-gold">{when}</p>
        {appointment.pro_display_name ? (
          <p className="mt-2 font-body text-sm text-cream/80">with {appointment.pro_display_name}</p>
        ) : null}
        {appointment.client_notes ? (
          <p className="mt-4 font-body text-sm text-gold-body">
            <span className="text-cream">Your notes:</span> {appointment.client_notes}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {!isCancelled && status === "confirmed" ? (
        <div className="flex flex-wrap gap-3">
          {canCancel ? (
            <GoldButton
              label={cancelling ? "Cancelling…" : "Cancel appointment"}
              onClick={() => void handleCancel()}
              variant="outlined"
              size="md"
              className={cancelling ? "pointer-events-none opacity-60" : ""}
            />
          ) : (
            <p className="font-body text-sm text-gold-body">{cancelMessage}</p>
          )}
          {appointment.pro_username ? (
            <GoldButton
              label="Reschedule"
              href={`/booking/new?pro=${appointment.pro_username}&service_id=${appointment.service_id ?? ""}`}
              variant="solid"
              size="md"
            />
          ) : null}
        </div>
      ) : null}

      {appointment.pro_username ? (
        <p className="font-body text-sm">
          <Link href={`/${appointment.pro_username}`} className="text-gold hover:underline">
            View professional profile
          </Link>
        </p>
      ) : null}
    </div>
  );
}
