import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { HELP_CATEGORIES, getHelpCategory } from "@/data/help-categories";
import { BRAND } from "@/lib/constants";

type Props = { params: { category: string } };

export function generateStaticParams() {
  return HELP_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = getHelpCategory(params.category);
  if (!cat) {
    return { title: "Help" };
  }
  return {
    title: `${cat.title} | Help Center`,
    description: `Help for ${cat.title} — articles coming with the Sif's Gold app launch.`,
    alternates: { canonical: `${BRAND.url}/help/${cat.slug}` },
  };
}

export default function HelpCategoryPage({ params }: Props) {
  const cat = getHelpCategory(params.category);
  if (!cat) {
    notFound();
  }

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Help", href: "/help" },
          { name: cat.title, href: `/help/${cat.slug}` },
        ]}
      />
      <header className="border-b border-gold/10 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">{cat.title}</h1>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/15 py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-cream/90">
            Help articles are coming with the app launch. For now, contact us via the contact form for support — include enough
            context in your message so we can help on the first reply.
          </p>
          <p className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:shadow-lg hover:shadow-gold/20"
            >
              Go to contact form
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
