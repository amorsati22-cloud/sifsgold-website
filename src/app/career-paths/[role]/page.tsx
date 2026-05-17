import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CAREER_PATH_STUBS, getCareerPath } from "@/data/career-paths";
import { BRAND } from "@/lib/constants";

type Props = { params: { role: string } };

export function generateStaticParams(): { role: string }[] {
  return CAREER_PATH_STUBS.map((c) => ({ role: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getCareerPath(params.role);
  if (!c) return { title: "Career path" };
  return {
    title: `${c.title} career path`,
    description: `${c.shortBlurb} Milestones, certifications, and earnings notes — illustrative until research backlog updates land.`,
    alternates: { canonical: `${BRAND.url}/career-paths/${c.slug}` },
  };
}

export default function CareerPathDetailPage({ params }: Props) {
  const c = getCareerPath(params.role);
  if (!c) notFound();
  const Icon = c.Icon;

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
          { name: c.title, href: `/career-paths/${c.slug}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-gold">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">Career path</p>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-black text-gold md:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-cream/88">{c.shortBlurb}</p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">From student to leader</h2>
          <ol className="mt-8 space-y-6 border-l border-gold/30 pl-6">
            {c.milestones.map((m) => (
              <li key={m.title} className="relative">
                <span className="absolute -left-[29px] top-1 flex h-3 w-3 rounded-full bg-gold" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-wide text-gold/90">{m.phase}</p>
                <p className="mt-1 font-heading text-xl text-cream">{m.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/80">{m.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h3 className="font-heading text-lg text-gold">Salary bands (stub)</h3>
              <p className="mt-3 text-sm text-cream/85">{c.salaryRange}</p>
              <p className="mt-4 text-sm text-cream/75">{c.earningsNote}</p>
            </div>
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h3 className="font-heading text-lg text-gold">Certifications & modules</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-cream/85">
                {c.certifications.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-light/15 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-sm text-cream/70">
            TODO: populate from research backlog — replace illustrative salary bands with verified market tables and add
            citations where we quote boards or BLS categories.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/career-paths" className="text-sm font-semibold text-gold underline-offset-4 hover:underline">
              All career paths
            </Link>
            <Link href="/#waitlist" className="text-sm font-semibold text-gold underline-offset-4 hover:underline">
              Join Sif&apos;s Circle
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
