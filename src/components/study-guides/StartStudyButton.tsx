"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startStudySession } from "@/lib/study-guides/actions";

export function StartStudyButton({
  deckId,
  locked,
  label = "Start session",
}: {
  deckId: string;
  locked?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (locked) {
    return (
      <p className="text-sm text-cream/60">
        Complete the previous deck to at least 80% mastery to unlock.
      </p>
    );
  }

  async function handleStart() {
    setLoading(true);
    setError(null);
    const result = await startStudySession(deckId);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/study-guides/study/${deckId}?session=${result.sessionId}`);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="inline-flex rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-60"
      >
        {loading ? "Starting…" : label}
      </button>
      {error ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
          {error.includes("Sign in") ? (
            <>
              {" "}
              <a href={`/sign-in?next=/study-guides/study/${deckId}`} className="text-gold underline">
                Sign in
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
