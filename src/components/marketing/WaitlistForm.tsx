"use client";

import { useState, type FormEvent } from "react";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

const WAITLIST_SUBJECT = "New Sif's Gold Waitlist Signup";

type WaitlistFormProps = {
  heading: string;
  id?: string;
  /** When set, replaces the default line under the heading */
  blurb?: string;
};

export function WaitlistForm({
  heading,
  id = "waitlist",
  blurb,
}: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
      <section
        id={id}
        className="scroll-mt-24 border-t border-white/10 bg-gradient-to-b from-navy-light/40 to-navy py-16 md:py-24"
      >
        <div className="mx-auto max-w-2xl px-4 text-center font-body sm:px-6">
          <p className="rounded-xl border border-gold/40 bg-navy-light/80 px-6 py-4 text-sm font-medium text-gold">
            You&apos;re on the list. We&apos;ll be in touch.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/10 bg-gradient-to-b from-navy-light/40 to-navy py-16 md:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 text-center font-body sm:px-6">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-offwhite sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 text-pretty text-white/70">
          {blurb ??
            `Be first to know when Sif's Gold opens. No spam — one line when it matters.`}
        </p>
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 md:flex-row md:items-stretch md:justify-center"
        >
          <input type="hidden" name="access_key" value={web3formsWaitlistAccessKey} />
          <input type="hidden" name="subject" value={WAITLIST_SUBJECT} />
          <label htmlFor={`${id}-email`} className="sr-only">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="min-h-12 w-full rounded-xl border border-white/20 bg-navy-dark/60 px-4 text-offwhite shadow-sm outline-none ring-gold/20 placeholder:text-white/40 focus:border-gold focus:ring-4"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl bg-gold px-8 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60 md:w-auto"
          >
            {status === "loading" ? "Joining…" : "Join waitlist"}
          </button>
        </form>
        {status === "error" ? (
          <p className="mt-4 text-center text-sm text-teal" role="alert">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </div>
    </section>
  );
}
