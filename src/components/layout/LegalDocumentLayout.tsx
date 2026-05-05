import Link from "next/link";

type LegalDocumentLayoutProps = {
  title: string;
  /** Name inserted into the placeholder line, e.g. "Privacy Policy". */
  documentLabel: string;
};

export function LegalDocumentLayout({ title, documentLabel }: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <div className="border-b border-white/10 bg-gradient-to-b from-navy-light/30 to-navy">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-3 text-sm text-white/40">Last updated: May 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <article
          className="rounded-2xl border border-white/10 bg-navy-light/20 p-8 sm:p-10 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-white/80"
          aria-label="Document preview"
        >
          <p className="font-mono text-sm text-white/70">
            [This page will contain the full {documentLabel} document. Content coming at launch.]
          </p>
        </article>

        <section className="mt-16 border-t border-white/10 pt-12">
          <h2 className="text-xl font-semibold tracking-tight text-offwhite">Questions?</h2>
          <p className="mt-3 text-sm text-white/70">
            Visit our{" "}
            <Link
              href="/help"
              className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
            >
              Help Center
            </Link>{" "}
            for support and common answers.
          </p>
        </section>
      </div>
    </div>
  );
}
