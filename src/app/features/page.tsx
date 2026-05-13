import type { Metadata } from "next";
import Link from "next/link";
import { FEATURE_HUB_LINKS } from "@/data/feature-deep-dives";
import { BRAND } from "@/lib/constants";
import { getFeatureLucide } from "@/components/features/feature-lucide";

export const metadata: Metadata = {
  title: "Features — platform pillars for The Gold Collective",
  description:
    "Explore booking, Health Hub, Photo Studio, music, education, community, payments, privacy, AI, state boards, brand deals, and the beauty supply store — all inside Sif's Gold.",
  alternates: { canonical: `${BRAND.url}/features` },
};

export default function FeaturesHubPage() {
  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col pb-16 sm:-mx-6 md:-mx-8">
      <header className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/15 bg-navy-deep/60 py-14 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-gold-body">Platform pillars</p>
          <h1 className="mt-4 font-heading text-4xl font-black text-gold md:text-5xl">Features</h1>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Each pillar below is a deep dive into how Sif&apos;s Gold serves students, pros, studios, brands, and clients
            inside The Gold Collective — with Sif&apos;s Advocates and Gold Partners shaping the details.
          </p>
          <p className="mt-6 text-sm text-cream/75">
            Ready to join? Use any deep-dive page to hop on the waitlist with a feature-specific source tag.
          </p>
        </div>
      </header>

      <div className="mx-auto mt-12 max-w-content px-4 sm:px-6 md:px-8">
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_HUB_LINKS.map((item) => {
            const Icon = getFeatureLucide(item.icon);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-brand-lg border border-gold/25 bg-navy-deep/60 p-6 transition duration-brand-medium motion-safe:hover:-translate-y-1 motion-safe:hover:border-gold motion-safe:hover:shadow-[inset_0_0_24px_theme(colors.teal/12%)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="mt-4 font-heading text-xl text-gold group-hover:underline">{item.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-cream/85">{item.blurb}</span>
                  <span className="mt-4 font-body text-xs font-semibold uppercase tracking-wide text-teal">
                    Read deep dive →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
