import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailStatus } from "@/components/auth/VerifyEmailStatus";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Confirm your Sif's Gold email address.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Email verification">
      <Suspense fallback={<p className="mt-8 text-center text-sm text-cream/70">Verifying…</p>}>
        <VerifyEmailStatus />
      </Suspense>
      <p className="mt-6 text-center text-sm text-cream/65">
        <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
