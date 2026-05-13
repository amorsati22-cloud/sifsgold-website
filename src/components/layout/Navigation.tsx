"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { WheatBranch } from "@/components/decorative/WheatBranch";
import { GoldButton } from "@/components/ui/GoldButton";

const NAV_LINKS = [
  { label: "For Pros", href: "/for-professionals" },
  { label: "For Clients", href: "/for-clients" },
  { label: "Schools & Salons", href: "/for-schools" },
  { label: "Fashion", href: "/fashion" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/#features" },
] as const;

const SCROLL_SOLID_PX = 80;

function linkActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function desktopLinkClass(pathname: string, href: string) {
  const active = linkActive(pathname, href);
  return `font-body text-sm font-medium transition hover:text-gold ${
    active ? "text-gold" : "text-cream/80"
  }`;
}

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_SOLID_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const navSolid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-brand-medium ${
          navSolid
            ? "border-gold/20 bg-navy/95 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-navy-deep text-gold shadow-sm ring-1 ring-gold/20">
              <GoddessProfile className="h-8 w-8" aria-hidden />
            </span>
            <WheatBranch className="hidden h-7 w-16 shrink-0 text-gold/60 sm:block" aria-hidden />
            <span className="font-heading text-xl font-bold tracking-tight text-gold sm:text-2xl">
              Sif&apos;s Gold
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={desktopLinkClass(pathname, item.href)}>
                {item.label}
              </Link>
            ))}
            <Link href="/sign-in" className={desktopLinkClass(pathname, "/sign-in")}>
              Sign In
            </Link>
            <GoldButton label="Join Sif's Circle" href="/#waitlist" variant="solid" size="sm" />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <GoldButton
              label="Join Sif's Circle"
              href="/#waitlist"
              variant="solid"
              size="sm"
              className="hidden sm:inline-flex"
            />
            <button
              type="button"
              className="inline-flex rounded-brand-sm p-2 text-gold transition hover:bg-white/5"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-7 w-7" aria-hidden /> : <Menu className="h-7 w-7" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-navy-deep/98 px-4 pb-10 pt-6 backdrop-blur-md sm:px-6 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="font-heading text-xl font-bold text-gold" onClick={closeMenu}>
              Sif&apos;s Gold
            </Link>
            <button
              type="button"
              className="rounded-brand-sm p-2 text-gold"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="h-7 w-7" aria-hidden />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile main navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-brand-md px-2 py-3 font-body text-lg font-medium ${
                  linkActive(pathname, item.href) ? "text-gold" : "text-cream/90"
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className={`rounded-brand-md px-2 py-3 font-body text-lg font-medium ${
                linkActive(pathname, "/sign-in") ? "text-gold" : "text-cream/90"
              }`}
              onClick={closeMenu}
            >
              Sign In
            </Link>
          </nav>
          <div className="mt-auto border-t border-gold/15 pt-8">
            <GoldButton
              label="Join Sif's Circle"
              href="/#waitlist"
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
