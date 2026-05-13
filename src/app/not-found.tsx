import Link from "next/link";

const STARFIELD_DOTS = Array.from({ length: 30 }, (_, i) => ({
  left: `${((i * 17 + 13) % 100)}%`,
  top: `${((i * 29 + 9) % 100)}%`,
}));

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-navy py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        {STARFIELD_DOTS.map((dot, idx) => (
          <span
            key={`${dot.left}-${dot.top}-${idx}`}
            className="absolute h-1 w-1 rounded-full bg-cream/70"
            style={{ left: dot.left, top: dot.top }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-content flex-col items-center px-4 text-center sm:px-6 md:px-8">
        <p className="font-heading text-[84px] font-black leading-none text-gold sm:text-[120px]">
          404
        </p>
        <h1 className="mt-3 font-heading text-4xl text-cream sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-cream/80">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or is being worked on.
        </p>

        <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
          >
            Back to Home
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-teal px-6 py-3 font-body text-sm font-semibold text-teal transition-all duration-brand-fast hover:bg-teal/10"
          >
            See Pricing
          </Link>
          <Link
            href="/#waitlist"
            className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 font-body text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10"
          >
            Join the Waitlist
          </Link>
        </div>

        <div className="mt-8 text-sm text-cream/75">
          <p className="font-semibold text-gold">Popular destinations:</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/for-professionals" className="hover:text-gold">
              For Professionals
            </Link>
            <Link href="/for-clients" className="hover:text-gold">
              For Clients
            </Link>
            <Link href="/for-schools" className="hover:text-gold">
              For Schools
            </Link>
            <Link href="/about" className="hover:text-gold">
              About
            </Link>
            <Link href="/help" className="hover:text-gold">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

