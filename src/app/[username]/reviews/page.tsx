import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeaveReviewForm } from "@/components/pro-profile/LeaveReviewForm";
import { ReviewsListClient } from "@/components/pro-profile/ReviewsListClient";
import { StarRating } from "@/components/pro-profile/StarRating";
import { BRAND } from "@/lib/constants";
import { averageRating, getPublicProProfileByUsername } from "@/lib/pro-profiles";
import { canUserReviewPro } from "@/lib/reviews";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) return { title: "Reviews not found" };
  const title = `${bundle.profile.display_name} — Reviews`;
  return {
    title,
    description: `Client reviews for ${bundle.profile.display_name} on Sif's Gold.`,
    alternates: { canonical: `/${bundle.profile.username}/reviews` },
    openGraph: { title, url: `${BRAND.url}/${bundle.profile.username}/reviews` },
  };
}

export default async function ProReviewsPage({ params }: PageProps) {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) notFound();

  const { profile, testimonials } = bundle;
  const avg = averageRating(testimonials);

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const canReview = await canUserReviewPro(user?.id ?? null, profile.id);

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <a href="#reviews-main" className="skip-link">
        Skip to reviews
      </a>
      <div className="border-b border-gold/10 bg-navy-deep/60 py-8">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-gold-body">
            <Link href={`/${profile.username}`} className="hover:text-gold">
              {profile.display_name}
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            <span className="text-cream">Reviews</span>
          </nav>
          <h1 id="reviews-main" className="mt-3 font-heading text-3xl text-gold">
            Client reviews
          </h1>
          {avg != null ? (
            <p className="mt-3 flex items-center gap-2 font-body text-sm text-cream">
              <StarRating rating={avg} />
              <span className="text-gold-body">
                {avg} average · {testimonials.length} review{testimonials.length === 1 ? "" : "s"}
              </span>
            </p>
          ) : (
            <p className="mt-2 font-body text-sm text-cream/70">No approved reviews yet.</p>
          )}
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-content gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_320px] md:px-8">
        <div>
          {testimonials.length === 0 ? (
            <p className="font-body text-cream/70">Reviews appear here after clients submit and you approve them.</p>
          ) : (
            <ReviewsListClient testimonials={testimonials} />
          )}
        </div>
        <aside>
          <LeaveReviewForm proId={profile.id} canReview={canReview} />
        </aside>
      </div>
    </div>
  );
}
