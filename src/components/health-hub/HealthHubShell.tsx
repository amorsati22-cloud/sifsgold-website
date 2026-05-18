"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { HEALTH_HUB_NAV } from "@/lib/health-hub/constants";

export function HealthHubShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy text-cream">
      <div
        className="border-b border-gold/15 px-4 py-8 sm:px-6 lg:px-8"
        style={{ backgroundColor: theme.colors.navyDeep }}
      >
        <div className="mx-auto max-w-content">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-goldBody">
            Private · Wellness tools
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-gold md:text-4xl">
            {title ?? "Health Hub"}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl font-body text-sm text-cream/80">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        <nav className="lg:w-56 lg:shrink-0" aria-label="Health Hub sections">
          <ul className="flex list-none flex-wrap gap-2 p-0 lg:flex-col lg:gap-1">
            {HEALTH_HUB_NAV.map((item) => {
              const active =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-brand-md px-3 py-2 font-body text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:transition-none ${
                      active
                        ? "bg-gold/15 text-gold"
                        : "text-cream/80 hover:bg-white/5 hover:text-gold"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
