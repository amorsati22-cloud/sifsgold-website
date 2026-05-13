"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { submitWaitlist } from "@/lib/web3forms";

type Notice = {
  type: "success" | "error";
  message: string;
} | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SifsCircleCTA() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);
  const reduceMotion = useReducedMotion();

  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${(index * 13) % 100}%`,
        delay: index * 0.03,
        color: index % 3 === 0 ? "bg-gold" : index % 3 === 1 ? "bg-teal" : "bg-cream",
      })),
    [],
  );

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const cleaned = email.trim();
    if (!EMAIL_REGEX.test(cleaned)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      setNotice({ type: "error", message: msg });
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice(null);
    const result = await submitWaitlist({ email: cleaned, source: "homepage_waitlist" });
    setSubmitting(false);

    if (!result.ok) {
      setNotice({
        type: "error",
        message: `${result.message} You can retry now.`,
      });
      return;
    }

    setJoined(true);
    setEmail("");
    setNotice({ type: "success", message: result.message });
  }

  return (
    <section
      id="waitlist"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-gold/10 bg-navy py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal className="relative overflow-hidden rounded-brand-lg border border-gold/25 bg-navy-deep/70 px-6 py-10 backdrop-blur-sm md:px-10 md:py-12">
          <h2 className="text-center font-heading text-3xl text-gold md:text-4xl">
            Be part of Sif&apos;s Circle.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-cream/85">
            Our founding members get a permanent Founding Member badge, lifetime founding-tier
            pricing, first access at launch, and a direct line to the team while we build.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl" noValidate>
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="waitlist-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "waitlist-error" : "waitlist-policy"}
                className="h-12 w-full rounded-full border border-cream/30 bg-navy px-4 text-cream placeholder:text-cream/50 transition duration-brand-fast focus:border-teal"
              />
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex h-12 items-center justify-center rounded-full border border-gold bg-gold px-6 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-75"
              >
                <span className="group-hover:animate-gold-shimmer">
                  {submitting ? "Joining..." : "Join the Circle"}
                </span>
              </button>
            </div>

            <p
              id="waitlist-error"
              className={`mt-3 text-sm text-gold-body ${error ? "block" : "sr-only"}`}
              aria-live="polite"
            >
              {error || "No error"}
            </p>

            <p id="waitlist-policy" className="mt-3 text-xs text-cream/65">
              By joining, you agree to receive emails from Sif&apos;s Gold. Unsubscribe anytime.
            </p>
          </form>

          {notice ? (
            <div
              className={`fixed right-4 top-24 z-[80] max-w-sm rounded-brand-md border px-4 py-3 text-sm shadow-nav ${
                notice.type === "success"
                  ? "border-gold/40 bg-navy-deep/95 text-cream"
                  : "border-teal/50 bg-navy-deep/95 text-cream"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                <p className="leading-relaxed">{notice.message}</p>
                {notice.type === "error" ? (
                  <button
                    type="button"
                    onClick={() => setNotice(null)}
                    className="inline-flex items-center gap-1 rounded-brand-sm px-1 text-xs font-semibold text-gold"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                    Retry
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {joined && !reduceMotion ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              {confetti.map((item) => (
                <motion.span
                  key={item.id}
                  className={`absolute top-0 h-2 w-2 rounded-sm ${item.color}`}
                  style={{ left: item.left }}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: [0, 40, 84], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, delay: item.delay, ease: "easeOut" }}
                />
              ))}
            </div>
          ) : null}
        </SectionReveal>
      </div>
    </section>
  );
}
