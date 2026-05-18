"use client";

import Link from "next/link";
import { useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { getSiteUrl } from "@/lib/auth/site-url";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ResetPasswordForm() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Password reset is not configured yet. Contact support if you need help.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/update-password`,
    });
    setLoading(false);

    if (resetError) {
      setError(getAuthErrorMessage(resetError));
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 text-center" role="status">
        <p className="font-heading text-xl text-gold">Check your email</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/85">
          If an account exists for <span className="font-semibold text-cream">{email}</span>, we sent a link to
          reset your password.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-4" aria-label="Reset password" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-cream">
          Email
        </label>
        <GlassInput
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      {error ? (
        <p
          className="rounded-lg border px-3 py-2 text-center text-sm"
          style={{ borderColor: `${colors.teal}55`, color: colors.cream }}
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        style={{ backgroundColor: colors.gold, color: colors.navy, outlineColor: colors.gold }}
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
