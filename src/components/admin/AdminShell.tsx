"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/advocates", label: "Advocates" },
  { href: "/admin/content-review", label: "Content review" },
  { href: "/admin/founding-members", label: "Founding Members" },
  { href: "/admin/campaigns", label: "Email Campaigns" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/disputes", label: "Disputes" },
] as const;

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1400px] gap-0 lg:gap-8">
        <aside className="hidden w-56 shrink-0 border-r border-gold/15 bg-navy-deep/80 px-4 py-8 lg:block">
          <p className="font-heading text-xs font-semibold uppercase tracking-wider text-gold-body">
            Command center
          </p>
          <p className="mt-1 truncate font-body text-sm text-cream/70" title={email}>
            {email}
          </p>
          <nav className="mt-8 space-y-1" aria-label="Admin navigation">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-brand-md px-3 py-2 text-sm font-medium transition motion-safe:hover:bg-gold/10 motion-reduce:hover:bg-transparent ${
                    active ? "bg-gold/15 text-gold" : "text-cream/85 hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/dashboard" className="mt-8 block text-sm text-gold-body underline-offset-4 hover:text-gold hover:underline">
            ← Back to dashboard
          </Link>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
