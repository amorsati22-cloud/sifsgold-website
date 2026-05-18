"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function PaymentFormInner({ onSuccess }: { onSuccess: (paymentIntentId: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setLoading(false);

    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <GoldButton
        label={loading ? "Processing…" : "Pay now"}
        type="submit"
        variant="solid"
        size="lg"
        className={loading ? "pointer-events-none opacity-70" : ""}
      />
    </form>
  );
}

type Props = {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
};

export function StripePaymentForm({ clientSecret, onSuccess }: Props) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <p className="font-body text-gold-body">
        Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable checkout.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
      <PaymentFormInner onSuccess={onSuccess} />
    </Elements>
  );
}
