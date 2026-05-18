"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { GlassInput } from "@/components/ui/GlassInput";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useTheme } from "@/components/theme/ThemeProvider";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") || "/dashboard";
  const queryError = searchParams.get("error");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Account sign-in is not configured yet. Join Sif's Circle on the homepage.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError));
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="mt-8">
      {queryError === "auth_failed" ? (
        <p
          className="mb-4 rounded-lg border px-3 py-2 text-center text-sm"
          style={{ borderColor: `${colors.teal}55`, color: colors.cream }}
          role="alert"
        >
          We could not complete sign-in. Please try again or reset your password.
        </p>
      ) : null}

      <OAuthButtons mode="sign-in" onError={setError} />

      <div className="my-6 flex items-center gap-3" aria-hidden>
        <div className="h-px flex-1 bg-white/15" />
        <span className="font-body text-xs uppercase tracking-wider text-cream/50">or</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <form className="space-y-4" aria-label="Sign in with email" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium text-cream">
            Email
          </label>
          <GlassInput
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium text-cream">
            Password
          </label>
          <GlassInput
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <p className="text-right text-sm">
          <Link
            href="/auth/reset-password"
            className="font-medium text-gold underline-offset-4 hover:text-gold-light hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Forgot password?
          </Link>
        </p>
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
          className="mt-2 w-full rounded-xl py-3 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:opacity-95 motion-reduce:hover:opacity-100 disabled:opacity-60"
          style={{ backgroundColor: colors.gold, color: colors.navy, outlineColor: colors.gold }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
