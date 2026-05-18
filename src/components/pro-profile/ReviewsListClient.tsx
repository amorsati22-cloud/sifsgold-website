"use client";

import { useMemo, useState } from "react";
import { StarRating } from "@/components/pro-profile/StarRating";
import type { Testimonial } from "@/types/pro-profile";

type SortKey = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

type ReviewsListClientProps = {
  testimonials: Testimonial[];
};

export function ReviewsListClient({ testimonials }: ReviewsListClientProps) {
  const [sort, setSort] = useState<SortKey>("date-desc");

  const sorted = useMemo(() => {
    const list = [...testimonials];
    list.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return list;
  }, [sort, testimonials]);

  return (
    <>
      <label className="flex flex-wrap items-center gap-2 font-body text-sm text-cream">
        Sort by
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="rating-desc">Highest rating</option>
          <option value="rating-asc">Lowest rating</option>
        </select>
      </label>
      <ul className="mt-6 list-none space-y-4 p-0">
        {sorted.map((review) => (
          <li key={review.id} className="rounded-brand-md border border-gold/10 bg-navy/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StarRating rating={review.rating} size="sm" />
              <time className="font-body text-xs text-cream/50" dateTime={review.created_at}>
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
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
    </>
  );
}
