"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitWeb3WithWaitlistKey } from "@/lib/waitlist-key-web3form";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CareersTalentPoolForm({ idPrefix }: { idPrefix: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setStatus("sending");
    const message = note.trim()
      ? `Talent pool signup\n\n${note.trim()}`
      : "Talent pool signup — notify me when roles open.";

    const result = await submitWeb3WithWaitlistKey(
      {
        name: trimmedName,
        email: trimmedEmail,
        message,
        source: "careers_talent_pool",
      },
      {
        subject: "Sif's Gold — careers talent pool",
        fromName: trimmedName,
      },
    );
    setStatus(result.ok ? "success" : "error");
    setServerMessage(result.message);
    if (result.ok) {
      setName("");
      setEmail("");
      setNote("");
    }
  }

  const nameId = `${idPrefix}-name`;
  const emailId = `${idPrefix}-email`;
  const noteId = `${idPrefix}-note`;
  const errId = `${idPrefix}-error`;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream focus:border-teal"
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
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={noteId} className="mb-1 block text-sm font-medium text-cream">
          Optional note (role interests, links)
        </label>
        <textarea
          id={noteId}
          name="note"
          rows={4}
          value={note}
          onChange={(ev) => setNote(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy-deep/80 px-4 py-3 text-cream focus:border-teal"
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
        className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70"
      >
        {status === "sending" ? "Joining…" : "Join the talent pool"}
      </button>
      {status === "success" ? (
        <p className="text-sm text-teal" role="status">
          You&apos;re on the list — we&apos;ll email you when roles open.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-gold-body" role="alert">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
