"use client";

import { useState } from "react";

export function NotifyMeForm({
  stateSlug,
  program,
  defaultEmail,
}: {
  stateSlug: string;
  program: string;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const res = await fetch("/api/state-board/notify-me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: stateSlug, program, email }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    setMessage("Check your inbox — we will notify you when this bank is ready.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label className="block text-sm text-cream/80">
        Email for notification
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full max-w-sm rounded-brand border border-gold/30 bg-navy-deep px-3 py-2 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading" || status === "done"}
        className="rounded-full border border-gold/50 px-5 py-2 text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Notify me when ready"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-goldBody"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
