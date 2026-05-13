import type { Metadata } from "next";
import Link from "next/link";
import { GlassInput } from "@/components/ui/GlassInput";

export const metadata: Metadata = {
  title: "Sign In | Sif's Gold",
  description: "Sign in to your Sif's Gold account.",
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
          <p className="mt-3 text-center text-sm text-white/65">
            Sign in to your Sif&apos;s Gold account
          </p>
          <form className="mt-8 space-y-4" action="#" method="post" aria-label="Sign in">
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
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/#waitlist"
              className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
            >
              Join the waitlist
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
