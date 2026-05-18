"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { web3formsWaitlistAccessKey } from "@/lib/web3forms";

const WAITLIST_SUBJECT = "New Sif's Circle signup — blog";

export function BlogCTA() {
  const theme = useTheme();
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

  return (
    <section
      id="sifs-circle-waitlist"
      className="not-prose scroll-mt-24 rounded-2xl border border-white/10 bg-navy-light/40 p-8 md:p-10"
      aria-labelledby="blog-waitlist-heading"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gold-body">Sif&apos;s Circle</p>
      <h2
        id="blog-waitlist-heading"
        className="mt-2 font-heading text-2xl font-bold text-cream md:text-3xl"
      >
        Join the waitlist for early access
      </h2>
      <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-cream/75">
        Be first to know when Sif&apos;s Gold opens for The Gold Collective — students, pros, Sif&apos;s
        Advocates, and Gold Partners shaping what ships next.
      </p>

      {status === "success" ? (
        <p
          className="mt-6 rounded-xl border px-4 py-3 text-sm font-medium"
          style={{ borderColor: theme.colors.gold, color: theme.colors.gold }}
          role="status"
        >
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      ) : (
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <input type="hidden" name="access_key" value={web3formsWaitlistAccessKey} />
          <input type="hidden" name="subject" value={WAITLIST_SUBJECT} />
          <input type="hidden" name="source" value="blog_article" />
          <label htmlFor="blog-waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="blog-waitlist-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Your email address"
            className="min-h-12 w-full flex-1 rounded-xl border border-white/20 bg-navy-deep/60 px-4 font-body text-cream outline-none placeholder:text-cream/40 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl px-8 text-sm font-semibold text-navy transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 motion-reduce:transition-none"
            style={{
              backgroundColor: theme.colors.gold,
              outlineColor: theme.colors.gold,
            }}
          >
            {status === "loading" ? "Joining…" : "Join Sif's Circle"}
          </button>
        </form>
      )}

      {status === "error" ? (
        <p className="mt-4 text-sm text-teal" role="alert">
          Something went wrong. Please try again, or use our{" "}
          <Link href="/contact" className="underline underline-offset-2">
            contact form
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
