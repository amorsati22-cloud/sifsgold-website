"use client";

import { useState } from "react";
import { requestPhotoConsent } from "@/lib/photo-studio/actions";
import { CONSENT_COPY } from "@/lib/photo-studio/constants";
import { GoldButton } from "@/components/ui/GoldButton";

type AppointmentRow = {
  id: string;
  client_consent_for_photos: boolean;
  photo_consent_requested_at: string | null;
  photo_consent_granted_at: string | null;
};

export function PhotoConsentPanel({ appointments }: { appointments: AppointmentRow[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function handleRequest(appointmentId: string) {
    setPending(appointmentId);
    setMessage(null);
    setLink(null);
    const result = await requestPhotoConsent(appointmentId);
    setPending(null);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    const fullUrl = `${window.location.origin}${result.consentUrl}`;
    setLink(fullUrl);
    setMessage(
      "Share this link with your client (e.g. via Pass a Note or appointment message). They must sign in to approve.",
    );
  }

  if (appointments.length === 0) {
    return (
      <p className="font-body text-sm text-cream/70">
        Completed appointments will appear here so you can request photo permission.
      </p>
    );
  }

  return (
    <section className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6" aria-labelledby="consent-heading">
      <h2 id="consent-heading" className="font-heading text-lg text-gold">
        Client photo consent
      </h2>
      <p className="mt-2 font-body text-sm text-goldBody">{CONSENT_COPY}</p>

      <ul className="mt-4 space-y-3">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-2 rounded-brand-md border border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-xs text-cream/60">{a.id.slice(0, 8)}…</p>
              {a.client_consent_for_photos ? (
                <p className="font-body text-sm text-teal">Consent granted</p>
              ) : a.photo_consent_requested_at ? (
                <p className="font-body text-sm text-goldBody">Request sent — awaiting client</p>
              ) : (
                <p className="font-body text-sm text-cream/75">No request yet</p>
              )}
            </div>
            {!a.client_consent_for_photos ? (
              <GoldButton
                label={pending === a.id ? "Creating link…" : "Request photo permission"}
                variant="outlined"
                onClick={() => handleRequest(a.id)}
              />
            ) : null}
          </li>
        ))}
      </ul>

      {message ? <p className="mt-4 font-body text-sm text-cream/85">{message}</p> : null}
      {link ? (
        <p className="mt-2 break-all font-mono text-xs text-teal">
          <a href={link} className="underline">
            {link}
          </a>
        </p>
      ) : null}
    </section>
  );
}
