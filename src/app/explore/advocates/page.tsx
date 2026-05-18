import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdvocateFeedFilters } from "@/components/advocate-feed/AdvocateFeedFilters";
import { AdvocateFeedInfinite } from "@/components/advocate-feed/AdvocateFeedInfinite";
import { listPublishedPosts } from "@/lib/advocate-feed/data";
import { BRAND } from "@/lib/constants";
import type { AdvocatePostType } from "@/types/challenges-feed";

export const metadata: Metadata = {
  title: "Sif's Advocates",
  description: "Tips, tutorials, and brand-partner content from Sif's Advocates — moderated and FTC-disclosed where required.",
  alternates: { canonical: `${BRAND.url}/explore/advocates` },
};

type Props = { searchParams: { type?: string; specialty?: string; brand?: string } };

export default async function AdvocatesExplorePage({ searchParams }: Props) {
  const postType = searchParams.type as AdvocatePostType | undefined;
  const specialty = searchParams.specialty;
  const brandPartnerOnly = searchParams.brand === "1";
  const { posts, nextCursor } = await listPublishedPosts({
    postType,
    specialty,
    brandPartnerOnly,
    limit: 12,
  });

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Explore", href: "/explore/body-map" },
          { name: "Advocates", href: "/explore/advocates" },
        ]}
      />
      <header className="border-b border-gold/15 py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold">Sif&apos;s Advocates</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Creator content from verified advocates. Every post is reviewed before publishing; brand partnerships include
            FTC disclosures.
          </p>
          <Link href="/advocates" className="mt-3 inline-block text-sm text-gold hover:underline">
            Become an advocate →
          </Link>
        </div>
      </header>
      <section className="py-10">
        <div className="mx-auto max-w-content space-y-6 px-4 sm:px-6 md:px-8">
          <AdvocateFeedFilters postType={postType} specialty={specialty} brandPartnerOnly={brandPartnerOnly} />
          <AdvocateFeedInfinite
            initialPosts={posts}
            initialCursor={nextCursor}
            filters={{ postType, specialty, brandPartnerOnly }}
          />
        </div>
      </section>
    </article>
  );
}
