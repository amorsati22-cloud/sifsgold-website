import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";
import { sifsGoldTheme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Brand Assets",
  description:
    "Sif's Gold logo placeholders, color palette, typography, voice guidelines, and usage policy — including retired naming.",
  alternates: { canonical: `${BRAND.url}/brand` },
};

const SWATCHES = [
  { name: "Navy", token: sifsGoldTheme.colors.navy },
  { name: "Navy deep", token: sifsGoldTheme.colors.navyDeep },
  { name: "Navy lift", token: sifsGoldTheme.colors.navyLift },
  { name: "Teal", token: sifsGoldTheme.colors.teal },
  { name: "Gold", token: sifsGoldTheme.colors.gold },
  { name: "Gold body", token: sifsGoldTheme.colors.goldBody },
  { name: "Gold light", token: sifsGoldTheme.colors.goldLight },
  { name: "Cream", token: sifsGoldTheme.colors.cream },
] as const;

export default function BrandPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Brand", href: "/brand" },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Brand Assets</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-cream/85">
            Official marks and guidance for press, partnerships, and approved announcements. Final vector files will publish
            here — for now, use the placeholders below for layout only.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Logo downloads</h2>
          <p className="mt-3 max-w-2xl text-sm text-cream/80">SVG and PNG packs will replace these boxes after asset upload.</p>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {["Full color lockup", "Monochrome gold", "Monochrome cream", "Wordmark", "App icon", "Social avatar"].map(
              (label) => (
                <li
                  key={label}
                  className="flex min-h-[140px] flex-col justify-end rounded-brand-lg border border-dashed border-gold/35 bg-navy-deep/60 p-4"
                >
                  <span className="text-sm font-semibold text-cream">{label}</span>
                  <span className="mt-1 text-xs text-cream/55">Placeholder — file coming soon</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Color palette</h2>
          <ul className="mt-8 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-4" role="list">
            {SWATCHES.map((swatch) => (
              <li key={swatch.name} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-4">
                <div
                  className="h-16 w-full rounded-brand-md border border-cream/15"
                  style={{ backgroundColor: swatch.token }}
                  aria-hidden
                />
                <p className="mt-3 font-heading text-sm text-cream">{swatch.name}</p>
                <p className="mt-1 font-mono text-xs text-gold-body">{swatch.token}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Typography</h2>
          <div className="mt-8 space-y-8">
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-body">Headlines — Playfair Display</p>
              <p className="mt-3 font-heading text-4xl font-black text-gold">Sif&apos;s Gold</p>
              <p className="mt-2 font-heading text-2xl text-cream">The Gold Collective moves together.</p>
            </div>
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-body">Body — Montserrat</p>
              <p className="mt-3 font-body text-base leading-relaxed text-cream/90">
                Warm, direct sentences beat jargon. We explain product behavior the way a great front desk would — clear,
                confident, never preachy.
              </p>
            </div>
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-body">Mono — Space Mono</p>
              <p className="mt-3 font-mono text-sm text-teal">REQ-20491 · STATE-MN-VERIFY · PAYOUT-2026-06</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Brand voice</h2>
          <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-base leading-relaxed text-cream/90">
            <li>Warm and welcoming — we respect the craft before the conversion.</li>
            <li>Direct — say what the feature does without hiding behind vague superlatives.</li>
            <li>Knowledgeable — cite real workflows, not imaginary futures.</li>
            <li>Not preachy — members already live the ethics; we support their standards.</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Forbidden words</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-cream/90">
            Do not use <span className="font-semibold text-gold">&quot;Kitted&quot;</span> — it is a retired former name and
            is fully out of circulation. Use <span className="font-semibold text-gold">Sif&apos;s Gold</span> in all public
            copy, decks, and captions.
          </p>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Usage policy</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-cream/90">
            Please use the Sif&apos;s Gold logo and brand assets only with explicit permission for press, partnership, or
            partnership announcements. If you are unsure, start with the{" "}
            <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
              contact form
            </Link>{" "}
            so we can route your request.
          </p>
        </div>
      </section>
    </article>
  );
}
