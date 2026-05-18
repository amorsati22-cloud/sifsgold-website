"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type VerifyState = "loading" | "success" | "expired" | "invalid" | "unconfigured";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<VerifyState>("loading");

  useEffect(() => {
    async function verify() {
      if (!isSupabaseConfigured()) {
        setState("unconfigured");
        return;
      }

      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!tokenHash || !type) {
        const error = searchParams.get("error");
        const errorCode = searchParams.get("error_code");
        if (errorCode === "otp_expired" || error === "access_denied") {
          setState("expired");
          return;
        }
        setState("invalid");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "email" | "signup" | "invite" | "recovery" | "email_change",
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("expired")) {
          setState("expired");
        } else {
          setState("invalid");
        }
        return;
      }

      setState("success");
      router.replace("/dashboard");
    }

    void verify();
  }, [searchParams, router]);

  if (state === "loading") {
    return <p className="mt-8 text-center text-sm text-cream/70">Confirming your email…</p>;
  }

  if (state === "success") {
    return (
      <p className="mt-8 text-center text-sm text-cream/85" role="status">
        Email verified. Taking you to your dashboard…
      </p>
    );
  }

  if (state === "unconfigured") {
    return (
      <p className="mt-8 text-center text-sm text-cream/85" role="alert">
        Email verification is not configured in this environment yet.
      </p>
    );
  }

  if (state === "expired") {
    return (
      <div className="mt-8 text-center" role="alert">
        <p className="font-heading text-xl text-gold">Link expired</p>
        <p className="mt-3 text-sm text-cream/85">
          This confirmation link has expired. Sign in to request a new verification email, or create a new account.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/sign-up" className="font-semibold text-gold underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 text-center" role="alert">
      <p className="font-heading text-xl text-gold">Invalid link</p>
      <p className="mt-3 text-sm text-cream/85">
        We could not verify this email link. It may have already been used or is malformed.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
