"use client";

import { useState } from "react";
import { StarRating } from "@/components/pro-profile/StarRating";
import { createClient } from "@/lib/supabase/client";

type ReviewRow = {
  id: string;
  client_name: string | null;
  rating: number;
  text: string;
  pro_reply: string | null;
  created_at: string;
  approved_by_pro: boolean;
  featured: boolean;
};

type ReviewsManagerProps = {
  proId: string;
  pending: ReviewRow[];
  approved: ReviewRow[];
};

export function ReviewsManager({ proId, pending, approved: initialApproved }: ReviewsManagerProps) {
  const [approved, setApproved] = useState(initialApproved);
  const [pendingList, setPendingList] = useState(pending);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  async function updateReview(
    id: string,
    patch: Partial<Pick<ReviewRow, "approved_by_pro" | "featured" | "pro_reply">>,
  ) {
    const supabase = createClient();
    await supabase.from("testimonials").update(patch).eq("id", id).eq("pro_id", proId);

    const row = pendingList.find((r) => r.id === id) ?? approved.find((r) => r.id === id);
    if (!row) return;
    const updated = { ...row, ...patch };

    if (patch.approved_by_pro === true) {
      setPendingList((p) => p.filter((r) => r.id !== id));
      setApproved((a) => [updated, ...a]);
    } else if (patch.approved_by_pro === false) {
      setApproved((a) => a.filter((r) => r.id !== id));
      setPendingList((p) => [updated, ...p]);
    } else {
      setApproved((a) => a.map((r) => (r.id === id ? updated : r)));
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-heading text-xl text-gold">Pending approval</h2>
        {pendingList.length === 0 ? (
          <p className="mt-2 font-body text-sm text-cream/70">No pending reviews.</p>
        ) : (
          <ul className="mt-4 list-none space-y-4 p-0">
            {pendingList.map((review) => (
              <li key={review.id} className="rounded-brand-md border border-gold/15 p-4">
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-2 font-body text-sm text-cream/90">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateReview(review.id, { approved_by_pro: true })}
                    className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReview(review.id, { approved_by_pro: false })}
                    className="rounded-full border border-cream/30 px-3 py-1 text-xs text-cream"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-heading text-xl text-gold">Published reviews</h2>
        <ul className="mt-4 list-none space-y-4 p-0">
          {approved.map((review) => (
            <li key={review.id} className="rounded-brand-md border border-gold/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StarRating rating={review.rating} size="sm" />
                <label className="flex items-center gap-1 font-body text-xs text-cream">
                  <input
                    type="checkbox"
                    checked={review.featured}
                    onChange={(e) => updateReview(review.id, { featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>
              <p className="mt-2 font-body text-sm text-cream/90">&ldquo;{review.text}&rdquo;</p>
              {review.pro_reply ? (
                <p className="mt-2 font-body text-sm text-cream/70">
                  <span className="text-gold">Your reply:</span> {review.pro_reply}
                </p>
              ) : null}
              <label className="mt-3 block font-body text-sm text-cream">
                Public reply
                <textarea
                  rows={2}
                  value={replyDraft[review.id] ?? review.pro_reply ?? ""}
                  onChange={(e) =>
                    setReplyDraft((d) => ({ ...d, [review.id]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  updateReview(review.id, { pro_reply: replyDraft[review.id]?.trim() || null })
                }
                className="mt-2 rounded-full border border-gold/30 px-3 py-1 text-xs text-gold"
              >
                Save reply
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
