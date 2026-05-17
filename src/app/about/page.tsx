import type { Metadata } from "next";
import Link from "next/link";
import { Accessibility, Factory, Shield, Users } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Sif's Gold",
  description:
    "Why Sif's Gold exists: better tools for beauty, grooming, fitness, and fashion — built in Minnesota inside The Gold Collective.",
  alternates: { canonical: `${BRAND.url}/about` },
};

const VALUES = [
  {
    title: "Privacy-first",
    body: "Sensitive signals get strict defaults, clear consent, and encryption where it matters. We do not sell your data and we do not run ads against your attention.",
    icon: Shield,
  },
  {
    title: "Inclusive",
    body: "Masculine, feminine, and non-binary experiences stay first-class — every craft in the room, not a side lane.",
    icon: Users,
  },
  {
    title: "Accessible",
    body: "We ship with WCAG-minded patterns so clients and pros can actually use the product — not admire it in a keynote.",
    icon: Accessibility,
  },
  {
    title: "Industry-built",
    body: "Workflows are shaped with Sif's Advocates and Gold Partners who live the day — not borrowed from generic marketplaces.",
    icon: Factory,
  },
] as const;

export default function AboutPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <header className="border-b border-gold/10 bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="max-w-4xl font-heading text-4xl font-black leading-tight text-gold md:text-5xl lg:text-6xl">
            Beauty, grooming, fitness, and fashion deserve better tools.
          </h1>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">From the founder</h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            I&apos;m Sati Brown. I started Sif&apos;s Gold because I kept watching brilliant people burn hours fighting software
            that was never built for how beauty, grooming, fitness, and fashion actually move — split across bookings, retail,
            education, community, and trust. I wanted one calm place where students, pros, studios, brands, and clients could
            share the same rails without surrendering their dignity or their data.
          </p>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            This is a private launch built with patience: fewer buzzwords, more receipts. If you are in the work, I hope the
            product feels like someone finally listened to your Tuesday — not your pitch deck.
          </p>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">The name</h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Sif is the Norse goddess of beauty, harvest, family, and the golden harvest of wheat. Sif&apos;s Gold is the
            platform that honors the people who do the work — the hands, the judgment, and the care that turn craft into
            culture.
          </p>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Values</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
                  <div className="mb-4 inline-flex rounded-full border border-gold/45 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-heading text-2xl text-gold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{value.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-gold md:text-4xl">Brand colors & typography</h2>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-cream/90">
            Deep navy grounds the UI so photography and skin tones read true. Gold carries warmth and ceremony without shouting.
            Teal signals action and modernity — the &quot;go&quot; color for buttons, focus rings, and positive motion. Headlines use
            Playfair Display for a editorial nod; Montserrat carries readable body copy; Space Mono appears for codes, IDs, and
            technical footnotes.
          </p>
        </div>
      </section>

      <section className="bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-cream/90">
            Built in Minnesota — designed for every U.S. state we serve, without publishing a street address during private
            launch.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#waitlist"
              className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20"
            >
              Join Sif&apos;s Circle
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
