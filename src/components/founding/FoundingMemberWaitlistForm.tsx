"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";
import { type SignupUserTypeSlug, SIGNUP_USER_TYPE_OPTIONS } from "@/data/signup-user-types";
import { submitWaitlist } from "@/lib/web3forms";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectClass =
  "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite shadow-sm outline-none ring-gold/20 backdrop-blur-sm focus:border-gold focus:ring-4";

export function FoundingMemberWaitlistForm({ idPrefix }: { idPrefix: string }) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<SignupUserTypeSlug>(SIGNUP_USER_TYPE_OPTIONS[0]!.slug);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("sending");
    const label = SIGNUP_USER_TYPE_OPTIONS.find((o) => o.slug === userType)?.label ?? userType;
    const result = await submitWaitlist({
      email: trimmed,
      source: "founding_member_waitlist",
      userType: label,
    });
    setStatus(result.ok ? "success" : "error");
    setMessage(result.message);
    if (result.ok) {
      setEmail("");
    }
  }

  const locked = status === "sending" || status === "success";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset disabled={locked} className="space-y-5 [&:disabled]:opacity-60">
        <div>
          <label htmlFor={`${idPrefix}-email`} className="mb-1.5 block text-sm font-medium text-offwhite">
            Email
          </label>
          <GlassInput
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-user-type`} className="mb-1.5 block text-sm font-medium text-offwhite">
            User type
          </label>
          <select
            id={`${idPrefix}-user-type`}
            name="user_type"
            value={userType}
            onChange={(ev) => setUserType(ev.target.value as SignupUserTypeSlug)}
            className={selectClass}
          >
            {SIGNUP_USER_TYPE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {status === "success" ? (
        <p className="rounded-xl border border-gold/40 bg-navy-light/80 px-4 py-3 text-sm font-medium text-gold" role="status">
          {message}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={locked}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Join Sif's Circle as a Founding Member"}
      </button>
    </form>
  );
}
