"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

type DashboardWelcomeProps = {
  email: string;
};

export function DashboardWelcome({ email }: DashboardWelcomeProps) {
  const { colors } = useTheme();

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="rounded-brand-lg border p-8 sm:p-10"
        style={{ borderColor: `${colors.gold}40`, backgroundColor: `${colors.navyDeep}CC` }}
      >
        <h1 className="font-heading text-3xl font-bold text-gold">Welcome, {email}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-cream/85">
          Your full dashboard — bookings, portfolio, brand deals, and more — ships in the next release. For now,
          this confirms your account is active inside The Gold Collective.
        </p>
        <form action="/api/auth/sign-out" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:bg-white/5 motion-reduce:hover:bg-transparent"
            style={{ borderColor: `${colors.gold}66`, color: colors.cream, outlineColor: colors.gold }}
          >
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
