"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitWeb3WithWaitlistKey } from "@/lib/waitlist-key-web3form";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LegalDmcaTakedownForm({ idPrefix }: { idPrefix: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workUrl, setWorkUrl] = useState("");
  const [infringingUrl, setInfringingUrl] = useState("");
  const [details, setDetails] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [accurate, setAccurate] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_REGEX.test(em)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!workUrl.trim() || !infringingUrl.trim()) {
      setError("Provide both the original work location and the allegedly infringing URL.");
      return;
    }
    if (!goodFaith || !accurate) {
      setError("Confirm both statements to submit a valid notice.");
      return;
    }
    setError("");
    setStatus("sending");
    const message = [
      `DMCA takedown notice`,
      ``,
      `Claimant: ${n}`,
      `Original / authorized work: ${workUrl.trim()}`,
      `Allegedly infringing material: ${infringingUrl.trim()}`,
      ``,
      `Details: ${details.trim() || "(none)"}`,
      ``,
      `Good faith statement: confirmed`,
      `Accuracy statement: confirmed`,
    ].join("\n");

    const res = await submitWeb3WithWaitlistKey(
      {
        name: n,
        email: em,
        message,
        source: "dmca_takedown",
      },
      {
        subject: "DMCA takedown notice — Sif's Gold",
        fromName: n,
      },
    );
    setStatus(res.ok ? "done" : "fail");
    setMsg(res.message);
    if (res.ok) {
      setName("");
      setEmail("");
      setWorkUrl("");
      setInfringingUrl("");
      setDetails("");
      setGoodFaith(false);
      setAccurate(false);
    }
  }

  const base = `${idPrefix}-`;

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor={`${base}name`} className="mb-1 block text-sm font-medium text-cream">
          Your name
        </label>
        <input
          id={`${base}name`}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={`${base}email`} className="mb-1 block text-sm font-medium text-cream">
          Your email
        </label>
        <input
          id={`${base}email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={`${base}work`} className="mb-1 block text-sm font-medium text-cream">
          Location of copyrighted work (URL or description)
        </label>
        <input
          id={`${base}work`}
          value={workUrl}
          onChange={(ev) => setWorkUrl(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={`${base}bad`} className="mb-1 block text-sm font-medium text-cream">
          Allegedly infringing URL on Sif&apos;s Gold
        </label>
        <input
          id={`${base}bad`}
          value={infringingUrl}
          onChange={(ev) => setInfringingUrl(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
          required
        />
      </div>
      <div>
        <label htmlFor={`${base}details`} className="mb-1 block text-sm font-medium text-cream">
          Additional facts
        </label>
        <textarea
          id={`${base}details`}
          rows={4}
          value={details}
          onChange={(ev) => setDetails(ev.target.value)}
          className="w-full rounded-brand-md border border-cream/25 bg-navy px-4 py-3 text-cream focus:border-teal"
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id={`${base}gf`}
          type="checkbox"
          checked={goodFaith}
          onChange={(ev) => setGoodFaith(ev.target.checked)}
          className="mt-1 h-4 w-4 rounded border border-cream/40 text-gold"
        />
        <label htmlFor={`${base}gf`} className="text-sm text-cream/90">
          I have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the
          law.
        </label>
      </div>
      <div className="flex items-start gap-3">
        <input
          id={`${base}acc`}
          type="checkbox"
          checked={accurate}
          onChange={(ev) => setAccurate(ev.target.checked)}
          className="mt-1 h-4 w-4 rounded border border-cream/40 text-gold"
        />
        <label htmlFor={`${base}acc`} className="text-sm text-cream/90">
          The information in this notice is accurate, and I am authorized to act on behalf of the owner of an exclusive right
          that is allegedly infringed.
        </label>
      </div>
      {error ? (
        <p className="text-sm text-gold-body" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit notice"}
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
