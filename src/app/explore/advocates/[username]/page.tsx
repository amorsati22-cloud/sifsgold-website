import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdvocatePostCard } from "@/components/advocate-feed/AdvocatePostCard";
import { FollowAdvocateButton } from "@/components/advocate-feed/FollowAdvocateButton";
import { getAdvocateByUsername, listAdvocatePosts } from "@/lib/advocate-feed/data";
import { SEED_ADVOCATE_ID } from "@/lib/advocate-feed/seed-data";
import { BRAND } from "@/lib/constants";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await getAdvocateByUsername(params.username);
  const name =
    (row?.advocate?.display_name as string) ?? (params.username === "advocate-demo" ? "Sif's Advocate" : params.username);
  return {
    title: `${name} — Advocate`,
    alternates: { canonical: `${BRAND.url}/explore/advocates/${params.username}` },
  };
}

export default async function AdvocateProfilePage({ params }: Props) {
  let row = await getAdvocateByUsername(params.username);
  if (!row && params.username === "advocate-demo") {
    row = {
      profile: { id: SEED_ADVOCATE_ID, username: "advocate-demo", avatar_url: null },
      advocate: { display_name: "Sif's Advocate", specialty_tags: ["hair", "education"] },
      followerCount: 1200,
      postCount: 3,
    };
  }
  if (!row) notFound();

  const posts = await listAdvocatePosts(row.profile.id as string);
  const displayName = (row.advocate.display_name as string) ?? params.username;
  const specialties = (row.advocate.specialty_tags as string[]) ?? (row.advocate.specialties as string[]) ?? [];

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Advocates", href: "/explore/advocates" },
          { name: displayName, href: `/explore/advocates/${params.username}` },
        ]}
      />
      <header className="border-b border-gold/15 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-black text-gold">{displayName}</h1>
              <p className="mt-2 text-sm text-cream/70">@{params.username}</p>
              {specialties.length > 0 ? (
                <p className="mt-2 text-xs text-goldBody">{specialties.join(" · ")}</p>
              ) : null}
            </div>
            <FollowAdvocateButton advocateId={row.profile.id as string} />
          </div>
          <dl className="mt-6 flex flex-wrap gap-8 text-sm">
            <div>
              <dt className="text-cream/55">Posts</dt>
              <dd className="font-medium text-gold">{row.postCount}</dd>
            </div>
            <div>
              <dt className="text-cream/55">Followers</dt>
              <dd className="font-medium text-gold">{row.followerCount}</dd>
            </div>
            <div>
              <dt className="text-cream/55">Partner brands</dt>
              <dd className="font-medium text-gold">{posts.filter((p) => p.post_type === "brand_partner").length}</dd>
            </div>
          </dl>
        </div>
      </header>
      <section className="py-10">
        <div className="mx-auto max-w-content space-y-6 px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-cream/70">No published posts yet.</p>
          ) : (
            posts.map((p) => <AdvocatePostCard key={p.id} post={p} />)
          )}
          <Link href="/explore/advocates" className="text-sm text-gold hover:underline">
            ← Back to feed
          </Link>
        </div>
      </section>
    </article>
  );
}
