import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getFeatureLucide } from "@/components/features/feature-lucide";
import { HELP_CATEGORIES } from "@/data/help-categories";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Help categories for Sif's Gold — articles ship with the app launch; contact us for support in the meantime.",
  alternates: { canonical: `${BRAND.url}/help` },
};

export default function HelpCenterPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Help", href: "/help" },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">How can we help?</h1>
          <p className="mt-4 max-w-2xl text-base text-cream/85">
            Browse categories below. Full articles arrive with the public app launch — until then, reach us through the
            contact form for support.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/15 py-10 md:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div
            className="relative max-w-2xl rounded-brand-lg border border-gold/25 bg-navy-deep/60 px-4 py-3 opacity-80"
            role="search"
            aria-label="Search help (coming soon)"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/70" aria-hidden />
            <input
              type="search"
              disabled
              readOnly
              tabIndex={-1}
              aria-disabled="true"
              placeholder="Search coming with app launch"
              className="w-full cursor-not-allowed rounded-brand-md border border-cream/15 bg-navy py-3 pl-12 pr-4 text-cream/60 outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-cream/55">Visual placeholder — search is not connected yet.</p>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="sr-only">Help categories</h2>
          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_CATEGORIES.map((cat) => {
              const Icon = getFeatureLucide(cat.icon);
              return (
                <li key={cat.slug}>
                  <Link
                    href={`/help/${cat.slug}`}
                    className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-gold"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="mt-4 font-heading text-xl text-gold">{cat.title}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-cream/80">{cat.blurb}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-navy-light/20 py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 md:px-8">
          <p className="text-base text-cream/90">Still need help?</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20"
          >
            Contact us
          </Link>
        </div>
      </section>
    </article>
  );
}
