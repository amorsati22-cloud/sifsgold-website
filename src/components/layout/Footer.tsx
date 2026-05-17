"use client";

import Link from "next/link";
import { Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { WheatBranch } from "@/components/decorative/WheatBranch";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/lib/consent";

const platformLinks = [
  { label: "For Pros", href: "/for-pros" },
  { label: "For Clients", href: "/for-clients" },
  { label: "For Students", href: "/for-students" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Salons", href: "/for-salons" },
  { label: "For Fashion", href: "/for-fashion" },
  { label: "For Brands", href: "/for-brands" },
] as const;

const resourcesLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Help Center", href: "#" },
  { label: "Status", href: "#" },
] as const;

const legalLinks = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "DMCA", href: "/legal/dmca" },
  { label: "CCPA", href: "/legal/ccpa" },
  { label: "HIPAA Notice", href: "/legal/hipaa-notice" },
  { label: "Refund Policy", href: "/legal/refund" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
  { label: "Community Guidelines", href: "/legal/community-guidelines" },
] as const;

const trustLinks = [
  { label: "Security", href: "#" },
  { label: "Privacy First", href: "#" },
  { label: "Account Deletion", href: "/delete" },
] as const;

function SocialPlaceholders() {
  const itemClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/35";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={itemClass} title="Coming soon" aria-label="Instagram coming soon">
        <Instagram className="h-5 w-5" aria-hidden />
      </span>
      <span className={itemClass} title="Coming soon" aria-label="TikTok coming soon">
        <Music2 className="h-5 w-5" aria-hidden />
      </span>
      <span className={itemClass} title="Coming soon" aria-label="LinkedIn coming soon">
        <Linkedin className="h-5 w-5" aria-hidden />
      </span>
      <span className={itemClass} title="Coming soon" aria-label="YouTube coming soon">
        <Youtube className="h-5 w-5" aria-hidden />
      </span>
    </div>
  );
}

export function Footer() {
  const openCookiePreferences = () => {
    window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
  };

  return (
    <footer className="border-t border-gold/20 bg-navy-deep">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 border-b border-gold/15 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-navy text-gold">
                <GoddessProfile className="h-9 w-9" aria-hidden />
              </span>
              <WheatBranch className="h-8 w-20 text-gold/50" aria-hidden />
            </div>
            <p className="mt-4 font-heading text-2xl font-bold text-gold">{BRAND.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
              {BRAND.tagline}
            </p>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[1px] text-cream/50">Social (coming soon)</p>
              <div className="mt-3">
                <SocialPlaceholders />
              </div>
            </div>
          </div>

          <nav aria-label="Footer platform links">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">Platform</h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/75 transition hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer resources links">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourcesLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/75 transition hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/75 transition hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer trust links">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">Trust</h3>
            <ul className="mt-4 space-y-3">
              {trustLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-cream/75 transition hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="font-body text-sm text-cream/75 transition hover:text-gold"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-6 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-cream/50">© 2026 Sif&apos;s Gold. All rights reserved.</p>
          <p className="text-sm text-cream/65">Built for everyone in beauty.</p>
          <button
            type="button"
            onClick={openCookiePreferences}
            className="inline-flex items-center justify-center rounded-full border border-gold/35 px-4 py-2 text-xs font-semibold uppercase tracking-[1px] text-gold-body transition hover:bg-gold/10 hover:text-gold"
          >
            Cookie Preferences
          </button>
        </div>
      </div>
    </footer>
  );
}
