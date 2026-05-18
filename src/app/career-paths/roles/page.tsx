import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CATEGORY_LABELS, SALARY_ESTIMATE_NOTE } from "@/lib/career-paths/constants";
import { listRoles } from "@/lib/career-paths/data";
import { BRAND } from "@/lib/constants";
import * as Icons from "lucide-react";
import type { RoleCategory } from "@/types/career-paths";

export const metadata: Metadata = {
  title: "Beauty career roles",
  description: "Browse roles with BLS median salary data, license requirements, and advancement paths.",
  alternates: { canonical: `${BRAND.url}/career-paths/roles` },
};

type Props = {
  searchParams: { category?: string; sort?: string };
};

export default async function RolesBrowsePage({ searchParams }: Props) {
  const category = searchParams.category as RoleCategory | undefined;
  const roles = await listRoles({ category });

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
          { name: "Roles", href: "/career-paths/roles" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold">Career roles</h1>
          <p className="mt-3 text-sm text-cream/75">{SALARY_ESTIMATE_NOTE} — Bureau of Labor Statistics OEWS.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/career-paths/roles" className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold">
              All
            </Link>
            {(Object.keys(CATEGORY_LABELS) as RoleCategory[]).map((cat) => (
              <Link
                key={cat}
                href={`/career-paths/roles?category=${cat}`}
                className={`rounded-full border px-3 py-1 text-xs ${
                  category === cat ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ul className="grid list-none gap-4 p-0 md:grid-cols-2">
            {roles.map((r) => {
              const Icon = (Icons as Record<string, Icons.LucideIcon>)[r.icon] ?? Icons.Briefcase;
              return (
                <li key={r.id}>
                  <Link
                    href={`/career-paths/roles/${r.id}`}
                    className="flex h-full gap-4 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 hover:border-gold/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-heading text-gold">{r.name}</p>
                      <p className="text-xs text-cream/60">{CATEGORY_LABELS[r.category]}</p>
                      <p className="mt-2 text-sm text-cream/85">
                        Median ${r.median_annual_salary.toLocaleString()}/yr
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}
