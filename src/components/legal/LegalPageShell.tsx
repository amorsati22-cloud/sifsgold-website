"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

type HeadingItem = {
  id: string;
  text: string;
};

export function LegalPageShell({
  title,
  lastUpdated = "Pending final review - to be set on launch",
  termlyEmbedId,
  children,
}: {
  title: string;
  lastUpdated?: string;
  termlyEmbedId?: string;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const h2s = Array.from(root.querySelectorAll("h2"));
    const computed = h2s.map((heading, index) => {
      if (!heading.id) {
        heading.id = `section-${index + 1}`;
      }
      return { id: heading.id, text: heading.textContent?.trim() || `Section ${index + 1}` };
    });
    setHeadings(computed);
  }, [children]);

  const toc = useMemo(() => headings, [headings]);
  const breadcrumbItems = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: title, href: pathname || "/legal/privacy" },
    ],
    [pathname, title],
  );

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy text-cream">
      <Breadcrumb items={breadcrumbItems} />
      <a
        href="#legal-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-brand-sm focus:bg-navy-deep focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to legal content
      </a>

      <section className="border-b border-gold/15 bg-navy py-14 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl text-gold md:text-5xl">{title}</h1>
          <p className="mt-4 font-body text-sm text-cream/80">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="bg-navy-light/20 py-10 md:py-14">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
          <aside className="legal-toc hidden md:block">
            <div className="sticky top-24 rounded-brand-md border border-gold/20 bg-navy-deep/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">
                Table of contents
              </p>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-cream/75 transition duration-brand-fast hover:text-gold"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div
            id="legal-main-content"
            ref={contentRef}
            className="legal-content max-w-[720px] rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6 md:p-8"
          >
            {children}

            {termlyEmbedId ? (
              <section className="mt-10 border-t border-gold/15 pt-6">
                <h2 id="termly-embed" className="legal-h2">
                  Policy Embed Slot
                </h2>
                <p className="legal-body mt-3">
                  Placeholder slot for final Termly embed or attorney-reviewed content.
                </p>
                <div
                  id={termlyEmbedId}
                  className="mt-4 rounded-brand-md border border-dashed border-gold/30 bg-navy p-4 text-sm text-cream/70"
                >
                  Termly embed placeholder: {termlyEmbedId}
                </div>
              </section>
            ) : null}

            <section className="mt-10 rounded-brand-md border border-gold/20 bg-navy p-5">
              <h2 id="questions" className="legal-h2">
                Have questions?
              </h2>
              <p className="legal-body mt-3">Contact us through the form on our homepage.</p>
            </section>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .legal-content {
          font-family: var(--font-montserrat);
          font-size: 16px;
          line-height: 1.6;
        }
        .legal-content .legal-h2,
        .legal-content h2 {
          font-family: var(--font-playfair);
          font-size: 28px;
          line-height: 1.3;
          color: var(--color-gold);
          margin-top: 1.75rem;
        }
        .legal-content .legal-h3,
        .legal-content h3 {
          font-family: var(--font-montserrat);
          font-weight: 600;
          font-size: 20px;
          line-height: 1.4;
          color: var(--color-cream);
          margin-top: 1.2rem;
        }
        .legal-content .legal-body,
        .legal-content p {
          color: var(--color-cream);
          opacity: 0.9;
        }
        .legal-content ul {
          margin-top: 0.75rem;
          margin-left: 1.1rem;
          list-style-type: disc;
          color: var(--color-cream);
          opacity: 0.9;
        }
        @media print {
          header,
          footer,
          .legal-toc {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .legal-content,
          .legal-content * {
            background: #ffffff !important;
            color: #000000 !important;
            border-color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </article>
  );
}

