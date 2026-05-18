import Link from "next/link";
import { StarRating } from "@/components/pro-profile/StarRating";
import { averageRating } from "@/lib/pro-profiles";
import type { ProProfile, Testimonial } from "@/types/pro-profile";

type ProTestimonialsSectionProps = {
  profile: ProProfile;
  testimonials: Testimonial[];
  limit?: number;
};

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProTestimonialsSection({
  profile,
  testimonials,
  limit = 3,
}: ProTestimonialsSectionProps) {
  const avg = averageRating(testimonials);
  const visible = testimonials.slice(0, limit);
  if (visible.length === 0) return null;

  return (
    <section className="border-b border-gold/10 bg-navy-deep/40 py-12 md:py-14" aria-labelledby="pro-reviews-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="pro-reviews-heading" className="font-heading text-2xl text-gold md:text-3xl">
            Client reviews
          </h2>
          {avg != null ? (
            <p className="flex items-center gap-2 font-body text-sm text-cream">
              <StarRating rating={avg} label={`Average rating ${avg} out of 5`} />
              <span className="text-gold-body">
                {avg} · {testimonials.length} review{testimonials.length === 1 ? "" : "s"}
              </span>
            </p>
          ) : null}
        </div>
        <ul className="mt-6 list-none space-y-4 p-0">
          {visible.map((review) => (
            <li
              key={review.id}
              className="rounded-brand-md border border-gold/10 bg-navy/50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="font-body text-xs text-cream/50">{formatReviewDate(review.created_at)}</span>
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-cream/90">&ldquo;{review.text}&rdquo;</p>
              {review.client_name ? (
                <p className="mt-2 font-body text-xs text-gold-body">— {review.client_name}</p>
              ) : null}
              {review.pro_reply ? (
                <blockquote className="mt-3 border-l-2 border-gold/30 pl-3 font-body text-sm text-cream/75">
                  <span className="text-gold">Reply:</span> {review.pro_reply}
                </blockquote>
              ) : null}
            </li>
          ))}
        </ul>
        {testimonials.length > limit ? (
          <p className="mt-6 font-body text-sm">
            <Link
              href={`/${profile.username}/reviews`}
              className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Read all reviews →
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
