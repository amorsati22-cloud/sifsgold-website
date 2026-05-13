import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { WheatBranch } from "@/components/decorative/WheatBranch";
import { GoldButton } from "@/components/ui/GoldButton";

const quickLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Pros", href: "/for-professionals" },
  { label: "For Clients", href: "/for-clients" },
  { label: "Schools", href: "/for-schools" },
  { label: "Fashion Industry", href: "/fashion" },
  { label: "Brand Partners", href: "/for-brands" },
  { label: "The Gold Collective", href: "/#gold-collective" },
  { label: "Help Center", href: "/help" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "DMCA", href: "/dmca" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Do Not Sell My Info (CCPA)", href: "/data-request" },
];

function SocialLinks() {
  const itemClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:border-teal hover:text-teal focus-visible:outline-none";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="https://www.instagram.com/"
        className={itemClass}
        aria-label="Sif's Gold on Instagram"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Instagram className="h-5 w-5" aria-hidden />
      </a>
      <a
        href="https://www.tiktok.com/"
        className={itemClass}
        aria-label="Sif's Gold on TikTok"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">TikTok</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      </a>
      <a
        href="https://www.pinterest.com/"
        className={itemClass}
        aria-label="Sif's Gold on Pinterest"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">Pinterest</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8-.1-.78-.2-2.01.04-2.87l1.18-4.99s-.3-.6-.3-1.48c0-1.38.8-2.41 1.8-2.41.85 0 1.26.64 1.26 1.4 0 .85-.54 2.12-.82 3.3-.23.98.5 1.78 1.47 1.78 1.77 0 3.13-1.87 3.13-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.79.74 2.29.08.1.09.19.07.29l-.28 1.12c-.04.18-.14.22-.33.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.05 6.6-6.05 3.46 0 6.16 2.47 6.16 5.77 0 3.45-2.18 6.22-5.2 6.22-1.02 0-1.98-.53-2.31-1.15l-.63 2.4c-.23.89-.85 2-1.27 2.67A9.99 9.99 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/"
        className={itemClass}
        aria-label="Sif's Gold on LinkedIn"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Linkedin className="h-5 w-5" aria-hidden />
      </a>
      <a
        href="https://www.threads.net/"
        className={itemClass}
        aria-label="Sif's Gold on Threads"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">Threads</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.186 2.004c-3.896 0-6.99 2.686-7.8 6.634-.006.032-.012.064-.018.096-.792 3.946-2.886 6.63-6.782 6.63h-.586v2.272h.586c4.59 0 7.334-2.892 8.382-7.746.848-4.22 3.106-6.886 6.218-6.886 3.42 0 6.2 2.78 6.2 6.2s-2.78 6.2-6.2 6.2c-1.728 0-3.292-.706-4.42-1.846l-1.608 1.608A8.15 8.15 0 0 0 12.186 22c4.51 0 8.186-3.676 8.186-8.186 0-4.51-3.676-8.186-8.186-8.186z" />
        </svg>
      </a>
      <a
        href="https://twitter.com/"
        className={itemClass}
        aria-label="Sif's Gold on X"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">X</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-navy-deep">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 border-b border-gold/15 pb-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-navy text-gold">
                <GoddessProfile className="h-9 w-9" aria-hidden />
              </span>
              <WheatBranch className="h-8 w-20 text-gold/50" aria-hidden />
            </div>
            <p className="mt-4 font-heading text-2xl font-bold text-gold">{BRAND.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
              Beauty, grooming, fitness, and fashion in one platform
            </p>
            <div className="mt-8 rounded-brand-lg border border-gold/20 bg-navy/60 p-5 backdrop-blur-sm">
              <p className="font-body text-sm font-semibold text-cream">Sif&apos;s Circle</p>
              <p className="mt-2 text-sm text-cream/70">
                Join the waitlist for founding access. No email signup here yet — use the full form
                on the homepage.
              </p>
              <div className="mt-4">
                <GoldButton label="Join Sif's Circle" href="/#waitlist" variant="solid" size="md" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold">Quick links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((item) => (
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
          </div>

          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-gold">Legal</h3>
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
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-cream/50">© 2026 Sif&apos;s Gold. All rights reserved.</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
