import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CareerFlowMap } from "@/components/career-paths/CareerFlowMap";
import { SavePathButton } from "@/components/career-paths/SavePathButton";
import { LEGACY_SLUG_TO_ROLE_ID } from "@/lib/career-paths/constants";
import { getPathWithDetails } from "@/lib/career-paths/data";
import { BRAND } from "@/lib/constants";

type Props = { params: { path_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = await getPathWithDetails(params.path_id);
  if (!path) return { title: "Career path" };
  return {
    title: path.name,
    description: path.description,
    alternates: { canonical: `${BRAND.url}/career-paths/${path.id}` },
  };
}

export default async function CareerPathMapPage({ params }: Props) {
  const legacyRoleId = LEGACY_SLUG_TO_ROLE_ID[params.path_id];
  if (legacyRoleId) {
    redirect(`/career-paths/roles/${legacyRoleId}`);
  }

  const path = await getPathWithDetails(params.path_id);
  if (!path) notFound();

  const shareUrl = `${BRAND.url}/career-paths/${path.id}`;

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
          { name: path.name, href: `/career-paths/${path.id}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl font-black text-gold md:text-4xl">{path.name}</h1>
          <p className="mt-3 max-w-3xl text-cream/85">{path.description}</p>
          <dl className="mt-6 flex flex-wrap gap-8 text-sm">
            <div>
              <dt className="text-cream/60">Estimated timeline</dt>
              <dd className="font-medium text-gold">~{path.estimated_total_years} years</dd>
            </div>
            <div>
              <dt className="text-cream/60">Estimated investment</dt>
              <dd className="font-medium text-cream">
                ${path.estimated_total_investment.toLocaleString()} (tuition, tools, licensure — varies)
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <SavePathButton pathId={path.id} startingPoint={path.starting_point} />
            <Link
              href={shareUrl}
              className="text-sm text-goldBody hover:text-gold"
              title="Copy link from browser address bar to share"
            >
              Share path (public URL)
            </Link>
          </div>
        </div>
      </header>

      <section className="py-10">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="mb-4 text-sm text-cream/70">
            Pan and zoom the map. Click nodes for requirements; role nodes show BLS median salary
            estimates.
          </p>
          <CareerFlowMap milestones={path.milestones} roles={path.roles} />
        </div>
      </section>
    </article>
  );
}
