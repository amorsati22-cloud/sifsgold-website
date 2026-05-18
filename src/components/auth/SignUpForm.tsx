"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { GlassInput } from "@/components/ui/GlassInput";
import { SIGNUP_USER_TYPE_OPTIONS, labelForSignupUserTypeSlug } from "@/data/signup-user-types";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { getSiteUrl } from "@/lib/auth/site-url";
import { resolveUserTypeFromSlug } from "@/lib/auth/user-types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useTheme } from "@/components/theme/ThemeProvider";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const { colors } = useTheme();

  const initialUserType = searchParams.get("userType") ?? "";
  const [userTypeSlug, setUserTypeSlug] = useState(initialUserType);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const userTypeLabel = useMemo(
    () => labelForSignupUserTypeSlug(userTypeSlug) ?? "your path",
    [userTypeSlug],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!userTypeSlug) {
      setError("Choose how you'll use Sif's Gold so we can personalize onboarding.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Account creation is not configured yet. Join Sif's Circle on the homepage.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const resolvedType = resolveUserTypeFromSlug(userTypeSlug);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
        data: {
          full_name: fullName.trim() || null,
          user_type: resolvedType,
          marketing_emails: marketingEmails,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError));
      return;
    }

    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="mt-8 text-center" role="status">
        <p className="font-heading text-xl text-gold">Check your email</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/85">
          We sent a confirmation link to <span className="font-semibold text-cream">{email}</span>. Open it to
          verify your account and enter The Gold Collective.
        </p>
        <p className="mt-6 text-sm text-cream/70">
          Already verified?{" "}
          <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <OAuthButtons mode="sign-up" onError={setError} />

      <div className="my-6 flex items-center gap-3" aria-hidden>
        <div className="h-px flex-1 bg-white/15" />
        <span className="font-body text-xs uppercase tracking-wider text-cream/50">or</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <form className="space-y-4" aria-label="Create account" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="signup-user-type" className="mb-1.5 block text-sm font-medium text-cream">
            I am joining as
          </label>
          <select
            id="signup-user-type"
            name="userType"
            required
            value={userTypeSlug}
            onChange={(e) => setUserTypeSlug(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-cream shadow-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/20"
          >
            <option value="">Select your starting place</option>
            {SIGNUP_USER_TYPE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug} className="bg-navy text-cream">
                {opt.label}
              </option>
            ))}
          </select>
          {userTypeSlug ? (
            <p className="mt-1 text-xs text-cream/65">Onboarding for {userTypeLabel} ships with your dashboard.</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-cream">
            Full name <span className="text-cream/50">(optional)</span>
          </label>
          <GlassInput
            id="signup-name"
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-cream">
            Email
          </label>
          <GlassInput
            id="signup-email"
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
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-cream">
            Password
          </label>
          <GlassInput
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <label className="flex items-start gap-3 text-sm text-cream/85">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gold/40 text-gold focus:ring-gold"
            checked={marketingEmails}
            onChange={(e) => setMarketingEmails(e.target.checked)}
          />
          <span>
            Send me product updates and Sif&apos;s Circle news. You can change this anytime in email preferences.
            Transactional emails (security, bookings) are always on.
          </span>
        </label>

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
          className="mt-2 w-full rounded-xl py-3 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 motion-safe:hover:opacity-95 motion-reduce:hover:opacity-100"
          style={{ backgroundColor: colors.gold, color: colors.navy, outlineColor: colors.gold }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
