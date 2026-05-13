"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { submitNewsletterSignup } from "@/lib/web3forms";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setSuccess("");
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    const result = await submitNewsletterSignup({ email: normalizedEmail });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setEmail("");
    setSuccess(result.message);
  }

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/10 bg-navy py-16 md:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal className="rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-6 md:p-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Stay in the loop</h2>
          <p className="mt-3 max-w-3xl text-cream/80">
            Industry updates, feature drops, and platform news. No spam, ever.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-6 max-w-2xl">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "newsletter-error" : "newsletter-policy"}
                className="h-12 w-full rounded-full border border-cream/30 bg-navy px-4 text-cream placeholder:text-cream/55"
              />
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex h-12 items-center justify-center rounded-full border border-gold bg-gold px-6 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-75"
              >
                <span className="group-hover:animate-gold-shimmer">
                  {submitting ? "Subscribing..." : "Subscribe"}
                </span>
              </button>
            </div>

            <p id="newsletter-policy" className="mt-3 text-xs text-cream/70">
              By subscribing, you agree to our{" "}
              <Link href="/legal/privacy" className="text-gold-body underline underline-offset-4 hover:text-gold">
                Privacy Policy
              </Link>
              . Unsubscribe anytime.
            </p>

            {error ? (
              <p id="newsletter-error" className="mt-3 inline-flex items-center gap-2 text-sm text-gold-body" aria-live="polite">
                {error}
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="inline-flex items-center gap-1 rounded-brand-sm border border-gold/30 px-2 py-1 text-xs font-semibold text-gold"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  Retry
                </button>
              </p>
            ) : null}

            {success ? (
              <p className="mt-3 text-sm text-cream" aria-live="polite">
                {success}
              </p>
            ) : null}
          </form>
        </SectionReveal>
      </div>
    </section>
  );
}
