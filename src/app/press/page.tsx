import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Brand assets, mission summary, and press inquiries for Sif's Gold.",
};

const ASSETS = [
  {
    title: "Logo — full color",
    href: "/press/assets/sifs-gold-logo-full.png",
    swatch: "bg-gradient-to-br from-gold/25 to-navy",
  },
  {
    title: "Logo — monochrome gold",
    href: "/press/assets/sifs-gold-logo-gold.png",
    swatch: "bg-gold/20",
  },
  {
    title: "Logo — monochrome white",
    href: "/press/assets/sifs-gold-logo-white.png",
    swatch: "bg-cream/20",
  },
  {
    title: "Wordmark only",
    href: "/press/assets/sifs-gold-wordmark.png",
    swatch: "bg-navy-light/70",
  },
  {
    title: "App icon",
    href: "/press/assets/sifs-gold-app-icon.png",
    swatch: "bg-teal/20",
  },
] as const;

const COLORS = [
  { name: "Navy", hex: "#04101E", className: "bg-navy" },
  { name: "Navy Lift", hex: "#0A1929", className: "bg-navy-light" },
  { name: "Teal", hex: "#00C9B1", className: "bg-teal" },
  { name: "Gold", hex: "#D4A843", className: "bg-gold" },
  { name: "Gold Light", hex: "#F0C060", className: "bg-gold-light" },
  { name: "Cream", hex: "#F5EFE0", className: "bg-cream" },
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
          <h1 className="font-heading text-[40px] text-gold md:text-[56px]">Press</h1>
          <p className="mt-4 text-lg text-cream/80">
            Brand assets, mission summary, and press inquiries.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">About Sif&apos;s Gold</h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-cream/85">
            Sif&apos;s Gold is the beauty platform built for everyone - beauty, grooming, fitness,
            and fashion in one place. The platform launches in 2026.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-cream/85">
            Sif&apos;s Gold serves licensed professionals, students, schools, salons, studios,
            clients, storefronts, and brand partners across all 50 U.S. states. Fashion industry
            expansion follows shortly after initial launch.
          </p>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Brand assets</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ASSETS.map((a) => (
              <li
                key={a.title}
                className="flex flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6"
              >
                <div className={`h-16 rounded-brand-md border border-cream/20 ${a.swatch}`} />
                <h3 className="mt-4 text-lg font-semibold text-cream">{a.title}</h3>
                <Link
                  href={a.href}
                  className="group mt-4 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-4 py-2 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
                >
                  <span className="group-hover:animate-gold-shimmer">Download .png</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-cream/75">
            Logo files will be available for download at launch. For early access, please contact
            us.
          </p>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Color palette</h2>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {COLORS.map((color) => (
              <div key={color.name} className="rounded-brand-md border border-gold/20 bg-navy-deep/70 p-3">
                <div className={`h-16 rounded-brand-sm border border-cream/20 ${color.className}`} />
                <p className="mt-2 text-xs font-semibold text-gold">{color.name}</p>
                <p className="text-xs text-cream/80">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Typography</h2>
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-brand-md border border-gold/20 bg-navy-deep/70 p-5">
              <p className="font-heading text-3xl text-gold">Playfair Display</p>
              <p className="mt-2 text-sm text-cream/75">Headlines</p>
            </div>
            <div className="rounded-brand-md border border-gold/20 bg-navy-deep/70 p-5">
              <p className="font-body text-lg text-cream">Montserrat sample paragraph text.</p>
              <p className="mt-2 text-sm text-cream/75">Body text</p>
            </div>
            <div className="rounded-brand-md border border-gold/20 bg-navy-deep/70 p-5">
              <p className="font-mono text-2xl text-cream">0123456789</p>
              <p className="mt-2 text-sm text-cream/75">Numerical data</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Voice and tone</h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-base text-cream/85">
            <li>Direct, never decorative</li>
            <li>Both feminine and masculine - never gendered language unless context requires</li>
            <li>Respect every craft equally</li>
            <li>&quot;We&quot; not &quot;I&quot; - anonymous brand voice</li>
            <li>Numbers and facts over adjectives</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Press inquiries</h2>
          <p className="mt-5 max-w-3xl text-base text-cream/85">
            For press inquiries, partnership requests, or interview requests, please use the
            contact form on our homepage. Our team will respond within 48 hours.
          </p>
          <Link
            href="/#waitlist"
            className="group mt-6 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
          >
            <span className="group-hover:animate-gold-shimmer">Go to contact form</span>
          </Link>
        </div>
      </section>

      <section className="bg-navy-light/20 py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-3xl text-cream md:text-4xl">Recent press</h2>
          <div className="mt-6 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
            <p className="text-cream/80">
              Press mentions and features will appear here as Sif&apos;s Gold launches.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
