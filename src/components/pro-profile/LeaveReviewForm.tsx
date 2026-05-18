"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type LeaveReviewFormProps = {
  proId: string;
  canReview: boolean;
};

export function LeaveReviewForm({ proId, canReview }: LeaveReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!canReview) {
    return (
      <p className="rounded-brand-md border border-gold/10 bg-navy/50 p-4 font-body text-sm text-cream/70">
        Reviews are available to clients after a completed appointment in the Sif&apos;s Gold app.
      </p>
    );
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("error");
        setMessage("Sign in to leave a review.");
        return;
      }

      const { error } = await supabase.from("testimonials").insert({
        pro_id: proId,
        client_id: user.id,
        rating,
        text: text.trim(),
      });

      if (error) throw error;
      setStatus("success");
      setMessage("Thank you. Your review will appear after the professional approves it.");
      setText("");
    } catch {
      setStatus("error");
      setMessage("Could not submit review. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-brand-lg border border-gold/10 bg-navy/50 p-5">
      <h2 className="font-heading text-xl text-gold">Leave a review</h2>
      <p className="mt-1 font-body text-sm text-cream/70">
        Only your first name and last initial appear publicly after approval.
      </p>
      <label className="mt-4 block font-body text-sm text-cream">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block font-body text-sm text-cream">
        Your experience
        <textarea
          required
          minLength={20}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 text-cream placeholder:text-cream/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          placeholder="Share what stood out about your visit…"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-navy hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit review"}
      </button>
      {message ? (
        <p
          className={`mt-3 font-body text-sm ${status === "error" ? "text-red-300" : "text-teal"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
