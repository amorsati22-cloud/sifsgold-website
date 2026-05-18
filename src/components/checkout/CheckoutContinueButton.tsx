"use client";

import { useState } from "react";

type Props = {
  tierId: string;
  billing: "monthly" | "annual";
  email?: string;
};

export function CheckoutContinueButton({ tierId, billing, email }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId, billing, email }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to start checkout. Please try again.");
        return;
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      setError("Checkout session did not return a redirect URL.");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleContinue}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Redirecting to Stripe…" : "Continue to payment"}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
