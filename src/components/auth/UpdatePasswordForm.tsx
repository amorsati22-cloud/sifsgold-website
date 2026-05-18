"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { GlassInput } from "@/components/ui/GlassInput";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useTheme } from "@/components/theme/ThemeProvider";

export function UpdatePasswordForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Password update is not configured yet.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(getAuthErrorMessage(updateError));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-4" aria-label="Set new password" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-cream">
          New password
        </label>
        <GlassInput
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthMeter password={password} />
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-cream">
          Confirm password
        </label>
        <GlassInput
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "Saving…" : "Update password"}
      </button>
      <p className="text-center text-sm text-cream/65">
        <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
