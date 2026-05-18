"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function TipForm({
  streamId,
  clientSecret,
  onClose,
  onSuccess,
}: {
  streamId: string;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setErr(null);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setErr(error.message ?? "Payment failed");
      setBusy(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      await fetch(`/api/streams/${streamId}/tip/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
      });
      onSuccess();
    }
    setBusy(false);
  }

  return (
    <form onSubmit={(e) => void pay(e)} className="space-y-3 p-4">
      <PaymentElement />
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50">
          {busy ? "Processing…" : "Send tip"}
        </button>
        <button type="button" onClick={onClose} className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function TipModal({
  open,
  streamId,
  clientSecret,
  onClose,
  onSuccess,
}: {
  open: boolean;
  streamId: string;
  clientSecret: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  if (!open || !clientSecret) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-brand-lg border border-gold/30 bg-navy-lift">
        <h3 className="border-b border-gold/20 px-4 py-3 font-display text-gold">Send a tip</h3>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <TipForm streamId={streamId} clientSecret={clientSecret} onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
}
