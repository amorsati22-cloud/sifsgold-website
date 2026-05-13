"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { submitDeletionRequest } from "@/lib/web3forms";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DeletePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address tied to your account.");
      return;
    }
    if (!isPermanent) {
      setError("Please confirm you understand this request is permanent.");
      return;
    }

    setError("");
    setSubmitting(true);
    const result = await submitDeletionRequest({
      fullName: trimmedName,
      email: trimmedEmail,
      reason,
    });
    setSubmitting(false);

    if (!result.ok) {
      setSuccessMessage("");
      setError(result.message);
      return;
    }

    setFullName("");
    setEmail("");
    setReason("");
    setIsPermanent(false);
    setError("");
    setSuccessMessage(result.message);
  }

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy py-16 text-cream md:py-24">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Delete Account", href: "/delete" },
        ]}
        className="mx-auto max-w-content px-4 pb-6 sm:px-6 md:px-8"
      />
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 md:p-10">
          <h1 className="font-heading text-3xl text-gold md:text-5xl">
            Account Deletion Request
          </h1>
          <p className="mt-3 text-sm text-cream/80">
            This page is publicly available and does not require login.
          </p>
          <p className="mt-2 text-sm text-cream/70">
            App Store Connect Account Deletion URL: https://sifsgold.com/delete
          </p>

          <div className="mt-6 rounded-brand-md border border-gold/35 bg-gold/10 p-4">
            <p className="text-sm leading-relaxed text-cream">
              Deleting your account permanently removes your profile, bookings, messages, photos,
              study progress, and earnings history. Transaction records are retained for 7 years
              for tax law compliance.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="delete-full-name"
                className="mb-2 block text-sm font-semibold text-cream"
              >
                Full name
              </label>
              <input
                id="delete-full-name"
                name="fullName"
                aria-label="Full name"
                aria-invalid={Boolean(error) && !fullName.trim() ? "true" : "false"}
                aria-describedby={error && !fullName.trim() ? "delete-form-error" : undefined}
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-12 w-full rounded-brand-md border border-cream/30 bg-navy px-4 text-cream placeholder:text-cream/55"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="delete-email"
                className="mb-2 block text-sm font-semibold text-cream"
              >
                Email address tied to account
              </label>
              <input
                id="delete-email"
                name="email"
                aria-label="Email address tied to account"
                aria-invalid={Boolean(error) && (!email.trim() || !EMAIL_PATTERN.test(email.trim())) ? "true" : "false"}
                aria-describedby={
                  error && (!email.trim() || !EMAIL_PATTERN.test(email.trim()))
                    ? "delete-form-error"
                    : undefined
                }
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-brand-md border border-cream/30 bg-navy px-4 text-cream placeholder:text-cream/55"
                placeholder="Enter your account email"
              />
            </div>

            <div>
              <label
                htmlFor="delete-reason"
                className="mb-2 block text-sm font-semibold text-cream"
              >
                Reason for deletion (optional)
              </label>
              <textarea
                id="delete-reason"
                name="reason"
                aria-label="Reason for deletion"
                rows={5}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="w-full rounded-brand-md border border-cream/30 bg-navy px-4 py-3 text-cream placeholder:text-cream/55"
                placeholder="Share context (optional)"
              />
            </div>

            <label className="flex items-start gap-3 rounded-brand-md border border-cream/20 bg-navy/70 p-3">
              <input
                type="checkbox"
                name="permanent"
                aria-label="I understand this is permanent and cannot be undone"
                aria-invalid={Boolean(error) && !isPermanent ? "true" : "false"}
                aria-describedby={error && !isPermanent ? "delete-form-error" : undefined}
                checked={isPermanent}
                onChange={(event) => setIsPermanent(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-gold"
              />
              <span className="text-sm text-cream">
                I understand this is permanent and cannot be undone
              </span>
            </label>

            {error ? (
              <p id="delete-form-error" className="text-sm text-gold-body" aria-live="polite">
                {error}
              </p>
            ) : null}
            {successMessage ? (
              <p
                className="rounded-brand-md border border-teal/50 bg-teal/10 p-3 text-sm text-cream"
                aria-live="polite"
              >
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-75 sm:w-auto"
            >
              <span className="group-hover:animate-gold-shimmer">
                {submitting ? "Submitting..." : "Submit deletion request"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

