import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Sif's Gold account — students, licensed pros, salons, schools, brands, and clients.",
  alternates: { canonical: `${BRAND.url}/sign-up` },
};

function SignUpFormFallback() {
  return <p className="mt-8 text-center text-sm text-cream/70">Loading sign-up…</p>;
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Join The Gold Collective"
      description="Create your account with email verification. Pick your path — you can add more roles later inside Sif's Gold."
    >
      <Suspense fallback={<SignUpFormFallback />}>
        <SignUpForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-cream/65">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
