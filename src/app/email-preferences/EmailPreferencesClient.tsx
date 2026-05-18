"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

type Props = {
  token: string;
  email: string;
  initialOptOut: boolean;
};

export function EmailPreferencesClient({ token, email, initialOptOut }: Props) {
  const theme = useTheme();
  const [marketingOptOut, setMarketingOptOut] = useState(initialOptOut);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/email/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, marketingOptOut }),
      });
      const data = (await res.json()) as { ok?: boolean };
      setStatus(data.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-body">Email preferences</p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-cream">Manage your email settings</h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-cream/75">
        Signed in as <span className="text-cream">{email}</span>. Transactional messages (account
        security, deletion confirmations, Advocate application updates) still send when required.
      </p>

      <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-navy-light/30 p-4">
        <input
          type="checkbox"
          checked={marketingOptOut}
          onChange={(e) => setMarketingOptOut(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-gold"
        />
        <span className="font-body text-sm text-cream/90">
          Opt out of marketing emails (Sif&apos;s Circle updates, launch announcements, and
          newsletters)
        </span>
      </label>

      <button
        type="button"
        onClick={save}
        disabled={status === "saving"}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl px-8 font-body text-sm font-semibold text-navy disabled:opacity-60 motion-reduce:transition-none"
        style={{ backgroundColor: theme.colors.gold }}
      >
        {status === "saving" ? "Saving…" : "Save preferences"}
      </button>

      {status === "saved" ? (
        <p className="mt-4 font-body text-sm text-teal" role="status">
          Preferences saved.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 font-body text-sm text-teal" role="alert">
          Could not save. Please try again.
        </p>
      ) : null}

      <p className="mt-10 font-body text-sm text-cream/65">
        <Link href="/" className="text-gold underline-offset-4 hover:underline">
          ← Back to Sif&apos;s Gold
        </Link>
      </p>
    </div>
  );
}
