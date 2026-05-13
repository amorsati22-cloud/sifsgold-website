"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitWeb3WithWaitlistKey } from "@/lib/waitlist-key-web3form";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LegalDataDeletionForm({ idPrefix }: { idPrefix: string }) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Enter the email address associated with your account.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm you understand this request is permanent.");
      return;
    }
    setError("");
    setStatus("sending");
    const body = `Data deletion request\n\nAccount email: ${trimmed}\nReason: ${reason.trim() || "(none)"}\nConfirmation: User acknowledged permanence.`;
    const res = await submitWeb3WithWaitlistKey(
      {
        email: trimmed,
        message: body,
        source: "data_deletion_request",
      },
      {
        subject: "Data deletion request — Sif's Gold",
        fromName: "Data deletion",
      },
    );
    setStatus(res.ok ? "done" : "fail");
    setMsg(res.message);
    if (res.ok) {
      setEmail("");
      setReason("");
      setConfirmed(false);
    }
  }

  const emailId = `${idPrefix}-email`;
  const reasonId = `${idPrefix}-reason`;
  const confirmId = `${idPrefix}-confirm`;
  const errId = `${idPrefix}-err`;

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor={emailId} className="mb-1 block text-sm font-medium text-cream">
          Account email
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errId : undefined}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={reasonId} className="mb-1 block text-sm font-medium text-cream">
          Reason (optional)
        </label>
        <textarea
          id={reasonId}
          rows={4}
          value={reason}
          onChange={(ev) => setReason(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id={confirmId}
          type="checkbox"
          checked={confirmed}
          onChange={(ev) => setConfirmed(ev.target.checked)}
          className="mt-1 h-4 w-4 rounded border border-cream/40 text-gold focus:ring-gold"
        />
        <label htmlFor={confirmId} className="text-sm leading-relaxed text-cream/90">
          I understand this deletion request is permanent and cannot be undone once processed.
        </label>
      </div>
      {error ? (
        <p id={errId} className="text-sm text-gold-body" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit deletion request"}
      </button>
      {status === "done" ? (
        <p className="text-sm text-teal" role="status">
          {msg}
        </p>
      ) : null}
      {status === "fail" ? (
        <p className="text-sm text-gold-body" role="alert">
          {msg}
        </p>
      ) : null}
    </form>
  );
}
