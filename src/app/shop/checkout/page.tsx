"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { StripePaymentForm } from "@/components/shop/StripePaymentForm";
import { GoldButton } from "@/components/ui/GoldButton";
import { cartSubtotal } from "@/lib/shop/cart";
import { formatCurrency } from "@/lib/shop/format";
import type { ShippingAddress, ShippingRateOption } from "@/lib/shop/types";

const STEPS = ["Contact & address", "Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  });
  const [email, setEmail] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingRateOption[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRateOption | null>(null);
  const [tax, setTax] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const subtotal = cartSubtotal(items);
  const shipping = selectedRate?.rate ?? 0;
  const total = subtotal + shipping + tax;

  const cartPayload = items.map((i) => ({
    product_id: i.product_id,
    variant_id: i.variant_id,
    quantity: i.quantity,
  }));

  async function calculateShipping() {
    const res = await fetch("/api/checkout/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_items: cartPayload, shipping_address: address }),
    });
    const data = await res.json();
    setShippingOptions(data.shipping_options ?? []);
    setSelectedRate(data.shipping_options?.[0] ?? null);
    setTax(data.tax ?? 0);
  }

  async function createPaymentIntent() {
    const res = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart_items: cartPayload,
        shipping_address: address,
        shipping_rate_id: selectedRate?.id,
        shipping_cost: shipping,
        buyer_email: email,
        buyer_name: address.name,
      }),
    });
    const data = await res.json();
    if (data.client_secret) {
      setClientSecret(data.client_secret);
      setPaymentIntentId(data.payment_intent_id);
    }
  }

  async function completeOrder(piId: string) {
    const res = await fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_intent_id: piId,
        shipping_address: address,
        shipping_method: selectedRate?.service,
        shipping_cost: shipping,
        buyer_email: email,
        buyer_name: address.name,
        buyer_notes: notes,
      }),
    });
    const data = await res.json();
    if (data.order_id) router.push(`/shop/order-confirmation/${data.order_id}`);
  }

  useEffect(() => {
    if (items.length === 0) router.replace("/shop/cart");
  }, [items, router]);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl text-gold">Checkout</h1>
      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Checkout steps">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-brand-full px-3 py-1 font-body text-xs ${
              i === step ? "bg-gold text-navy" : i < step ? "bg-gold/20 text-gold" : "bg-navy-lift text-cream/60"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {step === 0 && (
            <fieldset className="space-y-4">
              <legend className="font-heading text-xl text-gold">Contact &amp; shipping</legend>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                required
                placeholder="Full name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                required
                placeholder="Address line 1"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP"
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  className="rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
                />
              </div>
              <GoldButton label="Continue to shipping" onClick={() => { void calculateShipping(); setStep(1); }} variant="solid" />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-4">
              <legend className="font-heading text-xl text-gold">Shipping method</legend>
              {shippingOptions.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-brand-md border border-gold/20 p-4">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedRate?.id === opt.id}
                    onChange={() => setSelectedRate(opt)}
                    className="text-gold focus:ring-gold"
                  />
                  <span className="font-body text-cream">
                    {opt.carrier} {opt.service} — {formatCurrency(opt.rate)}
                    {opt.estimated_days != null && ` (${opt.estimated_days} days)`}
                  </span>
                </label>
              ))}
              <GoldButton
                label="Continue to payment"
                onClick={async () => {
                  await createPaymentIntent();
                  setStep(2);
                }}
                variant="solid"
              />
            </fieldset>
          )}

          {step === 2 && clientSecret && (
            <fieldset>
              <legend className="mb-4 font-heading text-xl text-gold">Payment</legend>
              <p className="mb-4 font-body text-sm text-gold-body">
                Card details are secured by Stripe. Sif&apos;s Gold never stores card numbers.
              </p>
              <StripePaymentForm
                clientSecret={clientSecret}
                onSuccess={() => setStep(3)}
              />
            </fieldset>
          )}

          {step === 3 && paymentIntentId && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl text-gold">Review your order</h2>
              <textarea
                placeholder="Order notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
                rows={3}
              />
              <GoldButton label="Place order" onClick={() => completeOrder(paymentIntentId)} variant="solid" size="lg" />
            </div>
          )}
        </div>

        <aside className="h-fit rounded-brand-md border border-gold/20 bg-navy-lift p-6">
          <p className="font-body text-sm text-cream">
            Subtotal: {formatCurrency(subtotal)}
            <br />
            Shipping: {formatCurrency(shipping)}
            <br />
            Tax: {formatCurrency(tax)}
            <br />
            <strong className="text-gold">Total: {formatCurrency(total)}</strong>
          </p>
        </aside>
      </div>
    </div>
  );
}
