"use client";

import Link from "next/link";
import { useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

export function SignInPlaceholderForm() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <form
      className="mt-8 space-y-4"
      aria-label="Sign in"
      onSubmit={(e) => {
        e.preventDefault();
        setNotice("Coming with launch");
      }}
    >
      <div>
        <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium text-offwhite">
          Email
        </label>
        <GlassInput
          id="signin-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium text-offwhite">
          Password
        </label>
        <GlassInput
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>
      <p className="text-right text-sm">
        <Link href="/forgot-password" className="font-medium text-gold underline-offset-4 hover:text-gold-light hover:underline">
          Forgot password?
        </Link>
      </p>
      {notice ? (
        <p className="rounded-lg border border-gold/35 bg-gold/10 px-3 py-2 text-center text-sm font-medium text-gold" role="status">
          {notice}
        </p>
      ) : null}
      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Sign in
      </button>
    </form>
  );
}
