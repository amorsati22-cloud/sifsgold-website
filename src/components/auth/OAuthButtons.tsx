"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/auth/site-url";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useTheme } from "@/components/theme/ThemeProvider";

type OAuthProvider = "google" | "apple";

type OAuthButtonsProps = {
  mode: "sign-in" | "sign-up";
  onError?: (message: string) => void;
};

export function OAuthButtons({ mode, onError }: OAuthButtonsProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<OAuthProvider | null>(null);
  const [appleUnavailable, setAppleUnavailable] = useState(false);

  const labelPrefix = mode === "sign-in" ? "Sign in" : "Sign up";

  async function handleOAuth(provider: OAuthProvider) {
    if (!isSupabaseConfigured()) {
      onError?.("Account sign-in is not configured yet. Join Sif's Circle on the homepage.");
      return;
    }

    setLoading(provider);
    onError?.("");

    try {
      const supabase = createClient();
      const redirectTo = `${getSiteUrl()}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: provider === "apple" ? { prompt: "login" } : undefined,
        },
      });

      if (error) {
        if (provider === "apple") {
          setAppleUnavailable(true);
        }
        onError?.(getAuthErrorMessage(error));
        setLoading(null);
      }
    } catch {
      if (provider === "apple") {
        setAppleUnavailable(true);
        onError?.("Apple sign-in is not available yet. Use email or Google, or try again later.");
      } else {
        onError?.("Could not start Google sign-in. Please try again.");
      }
      setLoading(null);
    }
  }

  const buttonBase =
    "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:opacity-95 motion-reduce:hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={buttonBase}
        style={{
          borderColor: `${colors.gold}66`,
          color: colors.cream,
          backgroundColor: "rgba(255,255,255,0.04)",
          outlineColor: colors.gold,
        }}
        disabled={loading !== null}
        onClick={() => handleOAuth("google")}
      >
        {loading === "google" ? "Connecting…" : `${labelPrefix} with Google`}
      </button>
      <button
        type="button"
        className={buttonBase}
        style={{
          borderColor: `${colors.cream}33`,
          color: colors.cream,
          backgroundColor: "rgba(255,255,255,0.02)",
          outlineColor: colors.gold,
        }}
        disabled={loading !== null || appleUnavailable}
        onClick={() => handleOAuth("apple")}
        title={appleUnavailable ? "Apple sign-in is not configured in Supabase yet" : undefined}
      >
        {loading === "apple"
          ? "Connecting…"
          : appleUnavailable
            ? "Apple sign-in (coming soon)"
            : `${labelPrefix} with Apple`}
      </button>
    </div>
  );
}
