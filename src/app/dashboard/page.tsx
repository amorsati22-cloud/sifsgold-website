import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-gold">Welcome back</h1>
      <p className="mt-3 max-w-xl font-body text-cream/85">
        Your private workspace for wellness tools, photo editing, and account features.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/health-hub"
          className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 transition hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          <span className="inline-block rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-teal">
            Private
          </span>
          <h2 className="mt-3 font-heading text-xl text-gold">Health Hub</h2>
          <p className="mt-2 font-body text-sm text-cream/80">
            Daily pulse, cycle sync, medications, hydration, and pre-shift ritual — opt-in wellness
            tracking only.
          </p>
        </Link>
        <Link
          href="/dashboard/photo-studio"
          className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 transition hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          <span className="inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-gold">
            Pro
          </span>
          <h2 className="mt-3 font-heading text-xl text-gold">Photo Studio</h2>
          <p className="mt-2 font-body text-sm text-cream/80">
            Before/after sliders, watermarks, AI background removal, social crops, and batch export —
            with client consent for portfolio use.
          </p>
        </Link>
      </div>
    </div>
  );
}
