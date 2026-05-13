import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

/** Curated cross-links — does not depend on modifying shared constants. */
const LEGAL_FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/accessibility", label: "Accessibility" },
  { href: "/legal/acceptable-use", label: "Acceptable use" },
  { href: "/legal/community-guidelines", label: "Community" },
  { href: "/legal/content-policy", label: "Content policy" },
  { href: "/legal/hipaa", label: "HIPAA" },
  { href: "/legal/hipaa-notice", label: "HIPAA notice (med spa)" },
  { href: "/legal/pro-agreement", label: "Pro agreement" },
  { href: "/legal/brand-agreement", label: "Brand agreement" },
  { href: "/legal/advocate-agreement", label: "Advocate agreement" },
  { href: "/legal/school-agreement", label: "School agreement" },
  { href: "/legal/seller-agreement", label: "Seller agreement" },
  { href: "/legal/minor-policy", label: "Minor policy" },
  { href: "/legal/ai-policy", label: "AI policy" },
  { href: "/legal/beta-disclosures", label: "Beta disclosures" },
  { href: "/legal/state-disclosures", label: "State disclosures" },
  { href: "/legal/do-not-sell", label: "Do not sell" },
  { href: "/legal/data-deletion", label: "Data deletion" },
  { href: "/legal/dmca", label: "DMCA" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/cancellation", label: "Cancellation" },
  { href: "/legal/refund", label: "Refund (archive)" },
  { href: "/legal/ccpa", label: "CCPA (archive)" },
  { href: "/contact", label: "Contact" },
];

export function LegalLayout({
  title,
  lastUpdated,
  currentPath,
  children,
}: {
  title: string;
  lastUpdated: string;
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal/privacy" },
          { name: title, href: currentPath },
        ]}
      />
      <a
        href="#legal-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-brand-sm focus:bg-navy-deep focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to legal content
      </a>

      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-bold text-gold md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-cream/75">Last updated: {lastUpdated}</p>
        </div>
      </header>

      <div className="bg-navy-light/20 py-10 md:py-14">
        <div
          id="legal-main"
          className="mx-auto max-w-content px-4 sm:px-6 md:px-8"
        >
          <div
            className="mx-auto max-w-[720px] rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6 font-body text-base leading-relaxed text-cream md:p-10 [&_h2]:mb-2 [&_h2]:mt-7 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-gold [&_h2:first-child]:mt-0 [&_h3]:mb-1.5 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-cream [&_li]:text-cream/90 [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:text-cream/90 [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:pl-0"
          >
            {children}
          </div>

          <nav
            className="mx-auto mt-10 max-w-[720px] rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-5 md:p-6"
            aria-label="Other legal documents"
          >
            <p className="font-heading text-lg text-gold">Other legal pages</p>
            <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-sm">
              {LEGAL_FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-cream/85 underline-offset-4 hover:text-gold hover:underline ${
                      item.href === currentPath ? "font-semibold text-gold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}

export function legalLastUpdated(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
