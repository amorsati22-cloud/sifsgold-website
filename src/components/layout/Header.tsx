"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { GoldButton } from "@/components/ui/GoldButton";

function scrollToTop() {
  window.scrollTo(0, 0);
}

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClassName(pathname: string, href: string) {
  const active = linkActive(pathname, href);
  return `shrink-0 font-body text-sm font-medium transition hover:text-gold ${
    active ? "text-gold" : "text-white/80"
  }`;
}

function mobileNavLinkClassName(pathname: string, href: string) {
  const active = linkActive(pathname, href);
  return `font-body text-lg font-medium transition hover:text-gold ${
    active ? "text-gold" : "text-white/80"
  }`;
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-dark/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 font-heading text-xl font-bold text-gold"
            onClick={() => scrollToTop()}
          >
            Sif&apos;s Gold
          </Link>

          <nav
            className="mx-4 hidden min-h-0 min-w-0 flex-1 items-center justify-center gap-x-4 gap-y-2 overflow-x-auto py-1 md:flex lg:gap-x-5"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClassName(pathname, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/fashion"
              className={`${navLinkClassName(pathname, "/fashion")} inline-flex items-center gap-2`}
            >
              <span>Fashion Side →</span>
              <span className="rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase leading-none text-gold">
                New June 30
              </span>
            </Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <GoldButton
              label="Join Waitlist"
              href="/#waitlist"
              variant="outlined"
              size="sm"
            />
            <GoldButton label="Sign In" href="/login" variant="solid" size="sm" />
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 text-gold md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex flex-col bg-navy-dark/98 px-4 pb-10 pt-6 backdrop-blur-sm sm:px-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-heading text-xl font-bold text-gold"
              onClick={() => {
                scrollToTop();
                closeMenu();
              }}
            >
              Sif&apos;s Gold
            </Link>
            <button
              type="button"
              className="text-gold"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-5 overflow-y-auto" aria-label="Mobile primary">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={mobileNavLinkClassName(pathname, item.href)}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/fashion"
              className={`flex flex-wrap items-center gap-2 ${mobileNavLinkClassName(pathname, "/fashion")}`}
              onClick={closeMenu}
            >
              <span>Fashion Side →</span>
              <span className="rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase leading-none text-gold">
                New June 30
              </span>
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-8">
            <GoldButton
              label="Join Waitlist"
              href="/#waitlist"
              variant="outlined"
              size="md"
              className="w-full"
              onClick={closeMenu}
            />
            <GoldButton
              label="Sign In"
              href="/login"
              variant="solid"
              size="md"
              className="w-full"
              onClick={closeMenu}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
