"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

type Props = {
  title: string;
  description?: string;
  nav: NavItem[];
  children: React.ReactNode;
};

export function DashboardShell({ title, description, nav, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-gold/20 pb-6">
        <h1 className="font-heading text-3xl text-gold md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl font-body text-cream/80">{description}</p>}
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Dashboard navigation">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-brand-sm px-3 py-2 font-body text-sm transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy ${
                      active ? "bg-gold/15 text-gold" : "text-cream/80 hover:bg-white/5 hover:text-gold"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}
