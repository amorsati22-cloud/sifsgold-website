import type { Metadata } from "next";
import Link from "next/link";
import { SignInPlaceholderForm } from "@/components/auth/SignInPlaceholderForm";

export const metadata: Metadata = {
  title: "Sign In | Sif's Gold",
  description: "Sign in to Sif's Gold — launching June 2026.",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-16 md:py-24">
      <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-gold to-teal" aria-hidden />
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-8 shadow-xl backdrop-blur-md sm:p-10">
          <h1 className="text-center font-heading text-3xl font-semibold tracking-tight text-offwhite sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-white/70">
            Sif&apos;s Gold launches June 2026. Waitlist members will receive sign-in instructions then.
          </p>
          <SignInPlaceholderForm />
          <p className="mt-6 text-center text-sm text-white/60">
            New here?{" "}
            <Link
              href="/#waitlist"
              className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
            >
              Join Sif&apos;s Circle
            </Link>
            {" · "}
            <Link href="/sign-up" className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline">
              Choose a user type
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
