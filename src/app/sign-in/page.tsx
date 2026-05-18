import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Sif's Gold — The Gold Collective for beauty, grooming, fitness, and fashion.",
};

function SignInFormFallback() {
  return <p className="mt-8 text-center text-sm text-cream/70">Loading sign-in…</p>;
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your account. Sif's Advocates, Gold Partners, and members of The Gold Collective use one secure login."
    >
      <Suspense fallback={<SignInFormFallback />}>
        <SignInForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-cream/65">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
