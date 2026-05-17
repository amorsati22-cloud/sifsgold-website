"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Public Web3Forms access key for advocate applications (override with env in production). */
const ADVOCATE_FORM_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ADVOCATE_KEY ?? "81476d95-3f7c-4f37-855b-bf4fba5b6cdb";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LICENSE_OPTIONS = [
  { value: "", label: "Select license status" },
  { value: "licensed_pro", label: "Licensed professional" },
  { value: "student_apprentice", label: "Student / apprentice" },
  { value: "creator_unlicensed", label: "Not licensed — creator focus" },
  { value: "prefer_not_say", label: "Prefer not to say" },
] as const;

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite shadow-sm outline-none ring-gold/20 backdrop-blur-sm placeholder:text-white/40 focus:border-gold focus:ring-4";

export function AdvocateApplicationForm({ idPrefix }: { idPrefix: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [socialHandles, setSocialHandles] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
    if (!socialHandles.trim()) {
      setError("Please add at least one social handle or profile link.");
      return;
    }
    if (!specialty.trim()) {
      setError("Please describe your specialty or niche.");
      return;
    }
    if (!licenseStatus) {
      setError("Please select your license status.");
      return;
    }
    if (!reason.trim()) {
      setError("Please tell us why you want to join.");
      return;
    }

    setError("");
    setStatus("sending");

    const sampleUrls = [url1, url2, url3].map((u) => u.trim()).filter(Boolean);
    const sampleContent = sampleUrls.length ? sampleUrls.join("\n") : "(none provided)";

    const body: Record<string, string> = {
      access_key: ADVOCATE_FORM_ACCESS_KEY,
      subject: `Sif's Advocate application — ${trimmedName}`,
      from_name: "Advocate application",
      name: trimmedName,
      email: trimmedEmail,
      social_handles: socialHandles.trim(),
      specialty_niche: specialty.trim(),
      sample_content_urls: sampleContent,
      license_status: licenseStatus,
      why_join: reason.trim(),
      source: "advocate_application",
      botcheck: "",
    };

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (res.ok && data?.success) {
        setName("");
        setEmail("");
        setSocialHandles("");
        setSpecialty("");
        setUrl1("");
        setUrl2("");
        setUrl3("");
        setLicenseStatus("");
        setReason("");
        setStatus("success");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const locked = status === "sending" || status === "success";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset disabled={locked} className="space-y-5 [&:disabled]:opacity-60">
        <div>
          <label htmlFor={`${idPrefix}-name`} className="mb-1.5 block text-sm font-medium text-offwhite">
            Name
          </label>
          <GlassInput
            id={`${idPrefix}-name`}
            name="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            autoComplete="name"
            required
          />
        </div>
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
          <label htmlFor={`${idPrefix}-social`} className="mb-1.5 block text-sm font-medium text-offwhite">
            Social handles
          </label>
          <textarea
            id={`${idPrefix}-social`}
            name="social_handles"
            value={socialHandles}
            onChange={(ev) => setSocialHandles(ev.target.value)}
            rows={3}
            className={fieldClass}
            placeholder="@handles or profile URLs"
            required
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-specialty`} className="mb-1.5 block text-sm font-medium text-offwhite">
            Specialty / niche
          </label>
          <GlassInput
            id={`${idPrefix}-specialty`}
            name="specialty"
            value={specialty}
            onChange={(ev) => setSpecialty(ev.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-offwhite">Sample content URLs (up to 3)</p>
          <div className="space-y-2">
            <GlassInput
              id={`${idPrefix}-url1`}
              name="sample_url_1"
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={url1}
              onChange={(ev) => setUrl1(ev.target.value)}
            />
            <GlassInput
              id={`${idPrefix}-url2`}
              name="sample_url_2"
              type="url"
              inputMode="url"
              placeholder="https://… (optional)"
              value={url2}
              onChange={(ev) => setUrl2(ev.target.value)}
            />
            <GlassInput
              id={`${idPrefix}-url3`}
              name="sample_url_3"
              type="url"
              inputMode="url"
              placeholder="https://… (optional)"
              value={url3}
              onChange={(ev) => setUrl3(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-license`} className="mb-1.5 block text-sm font-medium text-offwhite">
            License status
          </label>
          <select
            id={`${idPrefix}-license`}
            name="license_status"
            value={licenseStatus}
            onChange={(ev) => setLicenseStatus(ev.target.value)}
            className={fieldClass}
            required
          >
            {LICENSE_OPTIONS.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-why`} className="mb-1.5 block text-sm font-medium text-offwhite">
            Why you want to join
          </label>
          <textarea
            id={`${idPrefix}-why`}
            name="why_join"
            value={reason}
            onChange={(ev) => setReason(ev.target.value)}
            rows={5}
            className={fieldClass}
            required
          />
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {status === "success" ? (
        <p className="rounded-xl border border-gold/40 bg-navy-light/80 px-4 py-3 text-sm font-medium text-gold" role="status">
          Application received. We review applications monthly. We&apos;ll be in touch.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={locked}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
