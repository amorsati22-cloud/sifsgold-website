"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitWeb3WithWaitlistKey } from "@/lib/waitlist-key-web3form";

const REASONS = [
  "General",
  "Press",
  "Partnership",
  "Investor",
  "Bug report",
  "Other",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPageForm({ idPrefix }: { idPrefix: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!trimmedMessage) {
      setError("Please enter a message.");
      return;
    }

    setError("");
    setStatus("sending");
    const body = `Reason: ${reason}\n\n${trimmedMessage}`;
    const result = await submitWeb3WithWaitlistKey(
      {
        name: trimmedName,
        email: trimmedEmail,
        message: body,
        source: "contact_form",
      },
      {
        subject: `Sif's Gold contact — ${reason}`,
        fromName: trimmedName,
      },
    );
    setStatus(result.ok ? "success" : "error");
    setServerMessage(result.message);
    if (result.ok) {
      setName("");
      setEmail("");
      setMessage("");
      setReason(REASONS[0]);
    }
  }

  const nameId = `${idPrefix}-name`;
  const emailId = `${idPrefix}-email`;
  const reasonId = `${idPrefix}-reason`;
  const messageId = `${idPrefix}-message`;
  const errId = `${idPrefix}-error`;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5" noValidate>
      <div>
        <label htmlFor={nameId} className="mb-1 block text-sm font-medium text-cream">
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream placeholder:text-cream/45 focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={emailId} className="mb-1 block text-sm font-medium text-cream">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errId : undefined}
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream placeholder:text-cream/45 focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={reasonId} className="mb-1 block text-sm font-medium text-cream">
          Reason
        </label>
        <select
          id={reasonId}
          name="reason"
          value={reason}
          onChange={(ev) => setReason(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream focus:border-teal"
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={messageId} className="mb-1 block text-sm font-medium text-cream">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream placeholder:text-cream/45 focus:border-teal"
          required
        />
      </div>

      {error ? (
        <p id={errId} className="text-sm text-gold-body" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "success" ? (
        <p className="rounded-brand-md border border-teal/40 bg-teal/10 px-4 py-3 text-sm text-cream" role="status">
          {serverMessage}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="rounded-brand-md border border-gold/40 bg-navy-deep px-4 py-3 text-sm text-cream" role="alert">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
