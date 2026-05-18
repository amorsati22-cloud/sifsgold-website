"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { StripePaymentForm } from "@/components/shop/StripePaymentForm";
import { formatDuration, formatServicePrice } from "@/lib/services/format";
import type { ServiceWithAddons } from "@/types/services";
import type { DayAvailability, TimeSlot } from "@/types/booking";
import "react-day-picker/dist/style.css";

type ProInfo = {
  id: string;
  username: string;
  display_name: string;
  timezone: string;
};

type BookingWizardProps = {
  pro: ProInfo;
  services: ServiceWithAddons[];
  initialServiceId?: string;
  loggedIn?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

type Step = 1 | 2 | 3 | 4 | 5;

export function BookingWizard({ pro, services, initialServiceId, loggedIn }: BookingWizardProps) {
  const clientTz = useMemo(
    () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : pro.timezone),
    [pro.timezone],
  );

  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState(initialServiceId ?? services[0]?.id ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [calendar, setCalendar] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [reservation, setReservation] = useState<{
    appointment_id: string;
    reservation_token: string;
    reserved_until: string;
    deposit_required: boolean;
    deposit_amount: number;
  } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(loggedIn?.name ?? "");
  const [email, setEmail] = useState(loggedIn?.email ?? "");
  const [phone, setPhone] = useState(loggedIn?.phone ?? "");
  const [notes, setNotes] = useState("");

  const service = services.find((s) => s.id === serviceId) ?? services[0];

  const availableDates = useMemo(() => {
    const set = new Set(calendar.filter((d) => d.hasSlots).map((d) => d.date));
    return set;
  }, [calendar]);

  const loadCalendar = useCallback(async () => {
    if (!service) return;
    const start = format(new Date(), "yyyy-MM-dd");
    const res = await fetch(
      `/api/booking/availability?pro_id=${pro.id}&service_id=${service.id}&date=${start}&calendar_days=60`,
    );
    if (!res.ok) return;
    const data = await res.json();
    setCalendar(data.calendar ?? []);
  }, [pro.id, service]);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    if (!selectedDate || !service) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/booking/availability?pro_id=${pro.id}&service_id=${service.id}&date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedDate, pro.id, service]);

  async function reserveSlot() {
    if (!service || !selectedSlot) return;
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/booking/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pro_id: pro.id,
        service_id: service.id,
        scheduled_start: selectedSlot.start,
        scheduled_end: selectedSlot.end,
        addon_ids: addonIds,
        timezone: clientTz,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Could not reserve this time");
      return;
    }
    setReservation(data);
    setStep(3);
  }

  async function preparePayment() {
    if (!reservation) return;
    if (!reservation.deposit_required) {
      setStep(4);
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/booking/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: reservation.appointment_id,
        reservation_token: reservation.reservation_token,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.skip_payment) {
      setStep(4);
      return;
    }
    if (!res.ok) {
      setError(data.error ?? "Payment setup failed");
      return;
    }
    setClientSecret(data.client_secret);
    setStep(4);
  }

  async function confirmBooking(piId?: string | null) {
    if (!reservation) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: reservation.appointment_id,
        reservation_token: reservation.reservation_token,
        payment_intent_id: piId ?? paymentIntentId,
        client_details: {
          name,
          email,
          phone,
          notes,
          client_timezone: clientTz,
        },
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Could not confirm booking");
      return;
    }
    setStep(5);
    window.history.replaceState(null, "", `/booking/${data.appointment_id}`);
  }

  function formatSlotLabel(slot: TimeSlot) {
    return formatInTimeZone(parseISO(slot.start), clientTz, "h:mm a");
  }

  if (!service) {
    return (
      <p className="font-body text-cream/80">
        No bookable services found.{" "}
        <Link href={`/${pro.username}/services`} className="text-gold underline">
          View menu
        </Link>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-8 flex flex-wrap gap-2 font-body text-xs text-gold-body" aria-label="Booking steps">
        {(["Service", "Time", "Details", "Payment", "Done"] as const).map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-gold/20 text-gold" : "bg-navy/60"}`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {error ? (
        <p className="mb-4 rounded-brand-lg border border-red-500/40 bg-red-950/30 px-4 py-3 font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {step === 1 && (
        <section className="space-y-6">
          <h2 className="font-heading text-xl text-gold">Confirm service</h2>
          <p className="font-body text-sm text-gold-body">
            with {pro.display_name} · times shown in {clientTz.replace(/_/g, " ")}
          </p>
          {services.length > 1 ? (
            <label className="block font-body text-sm text-cream">
              <span className="text-gold-body">Service</span>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatServicePrice(s)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
            <h3 className="font-heading text-lg text-cream">{service.name}</h3>
            <p className="mt-1 font-body text-gold">{formatServicePrice(service)} · {formatDuration(service.duration_minutes)}</p>
            {service.addons.length > 0 ? (
              <fieldset className="mt-4 space-y-2">
                <legend className="font-body text-sm text-gold-body">Add-ons</legend>
                {service.addons.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 font-body text-sm text-cream">
                    <input
                      type="checkbox"
                      checked={addonIds.includes(a.id)}
                      onChange={(e) =>
                        setAddonIds((ids) =>
                          e.target.checked ? [...ids, a.id] : ids.filter((id) => id !== a.id),
                        )
                      }
                      className="rounded border-gold/30 text-gold focus:ring-gold"
                    />
                    {a.name}
                  </label>
                ))}
              </fieldset>
            ) : null}
          </div>
          <GoldButton label="Choose date & time" onClick={() => setStep(2)} variant="solid" size="lg" />
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <h2 className="font-heading text-xl text-gold">Pick a time</h2>
          <div className="rounded-brand-lg border border-gold/10 bg-navy/40 p-4 [&_.rdp]:mx-auto [&_.rdp-day]:text-cream">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const key = format(date, "yyyy-MM-dd");
                if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
                if (date > addDays(new Date(), 60)) return true;
                return calendar.length > 0 && !availableDates.has(key);
              }}
              fromDate={new Date()}
              toDate={addDays(new Date(), 60)}
            />
          </div>
          {selectedDate ? (
            <div>
              <p className="font-body text-sm text-gold-body">
                {format(selectedDate, "EEEE, MMMM d")}
              </p>
              {loadingSlots ? (
                <p className="mt-2 font-body text-sm text-cream/70">Loading times…</p>
              ) : slots.length === 0 ? (
                <p className="mt-2 font-body text-sm text-cream/70">No open slots this day.</p>
              ) : (
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <li key={slot.start}>
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full rounded-brand-lg border px-2 py-2 font-body text-sm transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy ${
                          selectedSlot?.start === slot.start
                            ? "border-gold bg-gold/20 text-gold"
                            : "border-gold/20 text-cream hover:border-gold/50"
                        }`}
                      >
                        {formatSlotLabel(slot)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          {reservation?.reserved_until ? (
            <p className="font-body text-xs text-gold-body">
              Hold expires {formatInTimeZone(parseISO(reservation.reserved_until), clientTz, "h:mm a")}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <GoldButton label="Back" onClick={() => setStep(1)} variant="outlined" size="md" />
            <GoldButton
              label={submitting ? "Holding…" : "Continue"}
              onClick={() => void reserveSlot()}
              variant="solid"
              size="lg"
              className={!selectedSlot || submitting ? "pointer-events-none opacity-60" : ""}
            />
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6">
          <h2 className="font-heading text-xl text-gold">Your details</h2>
          {selectedSlot ? (
            <p className="font-body text-sm text-gold">
              {formatInTimeZone(parseISO(selectedSlot.start), clientTz, "EEE, MMM d · h:mm a")}
            </p>
          ) : null}
          <div className="space-y-4">
            <label className="block font-body text-sm">
              <span className="text-gold-body">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block font-body text-sm">
              <span className="text-gold-body">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block font-body text-sm">
              <span className="text-gold-body">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block font-body text-sm">
              <span className="text-gold-body">Notes (allergies, preferences)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <GoldButton label="Back" onClick={() => setStep(2)} variant="outlined" size="md" />
            <GoldButton
              label={submitting ? "…" : "Continue to payment"}
              onClick={() => void preparePayment()}
              variant="solid"
              size="lg"
              className={!name || !email || submitting ? "pointer-events-none opacity-60" : ""}
            />
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6">
          <h2 className="font-heading text-xl text-gold">Payment</h2>
          {reservation?.deposit_required ? (
            <>
              <p className="font-body text-sm text-cream/80">
                Deposit due now:{" "}
                <span className="text-gold font-semibold">
                  ${Number(reservation.deposit_amount).toFixed(2)}
                </span>
              </p>
              {clientSecret ? (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  onSuccess={(pi) => {
                    setPaymentIntentId(pi);
                    void confirmBooking(pi);
                  }}
                />
              ) : (
                <p className="font-body text-sm text-cream/70">Preparing secure checkout…</p>
              )}
            </>
          ) : (
            <>
              <p className="font-body text-sm text-cream/80">Pay at your appointment — no deposit required.</p>
              <GoldButton
                label={submitting ? "Booking…" : "Book appointment"}
                onClick={() => void confirmBooking(null)}
                variant="solid"
                size="lg"
                className={submitting ? "pointer-events-none opacity-70" : ""}
              />
            </>
          )}
          <GoldButton label="Back" onClick={() => setStep(3)} variant="outlined" size="md" />
        </section>
      )}

      {step === 5 && reservation && (
        <section className="space-y-6 text-center">
          <h2 className="font-heading text-2xl text-gold">You&apos;re booked</h2>
          <p className="font-body text-cream/80">
            Confirmation sent to {email}. We&apos;ll send a reminder before your visit.
          </p>
          {selectedSlot ? (
            <p className="font-body text-gold">
              {formatInTimeZone(parseISO(selectedSlot.start), clientTz, "EEEE, MMMM d · h:mm a zzz")}
            </p>
          ) : null}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <GoldButton
              label="View appointment"
              href={`/booking/${reservation.appointment_id}`}
              variant="solid"
              size="lg"
            />
            {selectedSlot ? (
              <GoldButton
                label="Add to calendar"
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(service.name)}&dates=${formatInTimeZone(parseISO(selectedSlot.start), "UTC", "yyyyMMdd'T'HHmmss'Z'")}/${formatInTimeZone(parseISO(selectedSlot.end), "UTC", "yyyyMMdd'T'HHmmss'Z'")}`}
                variant="outlined"
                size="md"
              />
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

