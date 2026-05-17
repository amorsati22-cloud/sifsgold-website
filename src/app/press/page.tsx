import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Sif's Gold press facts, founder quote placeholder, and brand assets — private launch mode; inquiries via contact form.",
  alternates: { canonical: `${BRAND.url}/press` },
};

const FACTS = [
  { label: "Founding year", value: "2026" },
  { label: "Headquarters", value: "Minnesota, USA" },
  { label: "Industries served", value: "Beauty, grooming, fitness, fashion" },
  { label: "Launch window", value: "June 2026 (private launch)" },
] as const;

export default function PressPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Press", href: "/press" },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Press</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/85">
            Sif&apos;s Gold is in private launch mode. Press inquiries are welcome through our contact form — we read every
            message and respond as capacity allows.
          </p>
          <p className="mt-6">
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20"
            >
              Open contact form
            </Link>
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Quick facts</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {FACTS.map((row) => (
              <div key={row.label} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gold-body">{row.label}</dt>
                <dd className="mt-2 font-heading text-xl text-cream">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Founder quote</h2>
          <figure className="mt-8 max-w-3xl rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-8">
            <blockquote className="font-heading text-xl leading-relaxed text-cream md:text-2xl">
              <p>
                &quot;Placeholder quote — final approved language will ship with public launch. Until then, we are focused on
                builders, educators, and the people in the chair.&quot;
              </p>
            </blockquote>
            <figcaption className="mt-4 text-sm text-cream/70">— Sati Brown, Founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Brand assets</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/85">
            Logos, color specs, and typography live on the brand page. This press hub stays text-first during private launch.
          </p>
          <p className="mt-6">
            <Link
              href="/brand"
              className="inline-flex rounded-full border border-gold/60 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Download brand assets
            </Link>
          </p>
          <p className="mt-6 text-xs text-cream/60">
            This page is linked from the site footer only — it does not appear in the main navigation.
          </p>
        </div>
      </section>
    </article>
  );
}
