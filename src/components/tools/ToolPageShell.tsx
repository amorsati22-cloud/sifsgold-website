import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToolVisitTracker } from "@/components/tools/ToolVisitTracker";
import type { ToolSlug } from "@/types/tools";

type Props = {
  slug: ToolSlug;
  title: string;
  description: string;
  children: ReactNode;
};

export function ToolPageShell({ slug, title, description, children }: Props) {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <ToolVisitTracker slug={slug} />
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: title, href: `/tools/${slug}` },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-cream/80">{description}</p>
        </div>
      </header>
      <section className="bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-6 shadow-xl backdrop-blur-md md:p-10">
            {children}
          </div>
        </div>
      </section>
    </article>
  );
}
