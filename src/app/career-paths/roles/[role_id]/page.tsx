import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SalaryBlock } from "@/components/career-paths/SalaryBlock";
import { CATEGORY_LABELS } from "@/lib/career-paths/constants";
import { getPathsToRole, getRole } from "@/lib/career-paths/data";
import { getVisibleProUsernames } from "@/lib/pro-profiles";
import { BRAND } from "@/lib/constants";
import * as Icons from "lucide-react";

type Props = { params: { role_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = await getRole(params.role_id);
  if (!role) return { title: "Role" };
  return {
    title: `${role.name} — career role`,
    description: role.description,
    alternates: { canonical: `${BRAND.url}/career-paths/roles/${role.id}` },
  };
}

export default async function RoleDetailPage({ params }: Props) {
  const role = await getRole(params.role_id);
  if (!role) notFound();

  const pathsHere = await getPathsToRole(role.id);
  const pros = await getVisibleProUsernames();
  const Icon = (Icons as Record<string, Icons.LucideIcon>)[role.icon] ?? Icons.Briefcase;

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
          { name: "Roles", href: "/career-paths/roles" },
          { name: role.name, href: `/career-paths/roles/${role.id}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold/80">
                {CATEGORY_LABELS[role.category]}
              </p>
              <h1 className="font-heading text-4xl font-black text-gold">{role.name}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-cream/88">{role.description}</p>
        </div>
      </header>

      <section className="py-12">
        <div className="mx-auto max-w-content grid gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-2">
          <SalaryBlock role={role} />
          <div className="space-y-6 text-sm">
            <div>
              <h2 className="font-heading text-lg text-gold">Education & licensure</h2>
              <p className="mt-2 text-cream/85">{role.required_education}</p>
              <p className="mt-2 text-xs text-cream/60">
                Licenses: {role.required_license_types.map((l) => l.replace(/_/g, " ")).join(", ")}
              </p>
              <p className="mt-2 text-xs text-goldBody">
                Training hours and scope vary by state — verify with your board before enrolling.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-lg text-gold">Continuing education</h2>
              <p className="mt-2 text-cream/85">{role.typical_continuing_education}</p>
            </div>
            <div>
              <h2 className="font-heading text-lg text-gold">Specialty certifications</h2>
              <ul className="mt-2 list-disc pl-5 text-cream/85">
                {role.specialty_certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-lg text-gold">Common next steps</h2>
              <p className="mt-2 text-cream/85">{role.career_advancement}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/10 bg-navy-light/20 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Paths that include this role</h2>
          {pathsHere.length === 0 ? (
            <p className="mt-3 text-sm text-cream/70">Explore the career explorer to build a custom view.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pathsHere.map((p) => (
                <li key={p.id}>
                  <Link href={`/career-paths/${p.id}`} className="text-gold hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {pros.length > 0 ? (
        <section className="py-12">
          <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
            <h2 className="font-heading text-xl text-gold">Pros on Sif&apos;s Gold</h2>
            <p className="mt-2 text-sm text-cream/70">
              Public profiles — discover practitioners working in related specialties.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pros.slice(0, 8).map((username) => (
                <li key={username}>
                  <Link
                    href={`/${username}`}
                    className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold hover:bg-gold/10"
                  >
                    @{username}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
