import Link from "next/link";
import type { ReactNode } from "react";

export function TrackerCard({
  title,
  href,
  children,
  status,
}: {
  title: string;
  href: string;
  children: ReactNode;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-5 transition hover:border-gold/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-lg font-semibold text-gold">{title}</h3>
        {status ? (
          <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 font-body text-xs text-goldBody">
            {status}
          </span>
        ) : null}
      </div>
      <div className="mt-3 font-body text-sm text-cream/85">{children}</div>
    </Link>
  );
}
