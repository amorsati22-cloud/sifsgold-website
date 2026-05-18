"use client";

import Link from "next/link";
import { Instagram, Music2, Share2 } from "lucide-react";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/lib/consent";

const sifsGoldLinks = [
  { label: "About", href: "/about" },
  { label: "Sif's Advocates", href: "/advocates" },
  { label: "Founding Member", href: "/founding-member" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
] as const;

const forYouLinks = [
  { label: "For Clients", href: "/for-clients" },
  { label: "For Pros", href: "/for-pros" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Salons", href: "/for-salons" },
  { label: "For Fashion", href: "/for-fashion" },
  { label: "For Brands", href: "/for-brands" },
] as const;

const resourcesLinks = [
  { label: "Study Guides", href: "/study-guides" },
  { label: "Career Paths", href: "/career-paths" },
  { label: "Tools", href: "/tools" },
  { label: "Glossary", href: "/glossary" },
  { label: "Blog", href: "/blog" },
  { label: "Help Center", href: "/help" },
] as const;

const trustLinks = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Security", href: "/security" },
  { label: "Trust Center", href: "/trust" },
  { label: "Do Not Sell", href: "/legal/do-not-sell" },
] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/sifsgold",
    icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@sifsgold",
    icon: Music2,
  },
  {
    label: "Threads",
    href: "https://www.threads.net/@sifsgold",
    icon: Share2,
  },
] as const;

function FooterLinkColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel}>
      <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((item) => (
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
  );
}

export function Footer() {
  const openCookiePreferences = () => {
    window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
  };

  return (
    <footer className="border-t border-gold/20 bg-navy-deep">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 border-b border-gold/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <FooterLinkColumn title="Sif's Gold" links={sifsGoldLinks} ariaLabel="Sif's Gold links" />
          <FooterLinkColumn title="For You" links={forYouLinks} ariaLabel="For You links" />
          <FooterLinkColumn title="Resources" links={resourcesLinks} ariaLabel="Resources links" />
          <nav aria-label="Trust links">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold-body">Trust</h3>
            <ul className="mt-4 space-y-3">
              {trustLinks.map((item) => (
                <li key={item.href}>
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

        <div className="pt-10">
          <p className="text-center text-sm text-cream/60">
            © 2026 Sif&apos;s Gold · Beauty, grooming, fitness, and fashion in one platform · Launching June
            2026
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream/80 transition hover:border-gold/50 hover:text-gold"
                aria-label={`${label} (opens in new tab)`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
