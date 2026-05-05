"use client";

import { useState } from "react";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

const WAITLIST_SUBJECT = "New Sif's Gold Waitlist Signup";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const form = e.currentTarget;
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });
      const data = (await res.json()) as { success?: boolean };
      if (res.ok && data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mx-auto max-w-lg text-center text-lg text-gold">
        You&apos;re on the list. See you June 1. 👑
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-stretch"
      >
        <input type="hidden" name="access_key" value={web3formsWaitlistAccessKey} />
        <input type="hidden" name="subject" value={WAITLIST_SUBJECT} />
        <label htmlFor="waitlist-email" className="sr-only">
          Email for waitlist
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="min-h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/40 backdrop-blur-sm transition focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-12 w-full shrink-0 rounded-full bg-gold px-8 font-body text-sm font-semibold text-navy transition hover:bg-gold-light disabled:opacity-60 md:w-auto"
        >
          {status === "loading" ? "Joining…" : "Join the Waitlist"}
        </button>
      </form>
      {status === "error" ? (
        <p className="mt-4 text-center text-sm text-teal" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </div>
  );
}
