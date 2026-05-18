"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";

export default function StorefrontSettingsPage() {
  const [form, setForm] = useState({
    store_name: "",
    store_slug: "",
    description: "",
    default_shipping_origin_zip: "",
    return_policy: "",
    shipping_policy: "",
    customer_service_email: "",
    payout_method: "stripe_express",
  });

  return (
    <DashboardShell title="Storefront settings" nav={STOREFRONT_NAV}>
      <form className="max-w-xl space-y-4">
        <label className="block font-body text-sm text-gold">
          Store name
          <input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} className={inputClass} />
        </label>
        <label className="block font-body text-sm text-gold">
          Store slug
          <input value={form.store_slug} onChange={(e) => setForm({ ...form, store_slug: e.target.value })} className={inputClass} />
        </label>
        <label className="block font-body text-sm text-gold">
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={3} />
        </label>
        <label className="block font-body text-sm text-gold">
          Shipping origin ZIP
          <input value={form.default_shipping_origin_zip} onChange={(e) => setForm({ ...form, default_shipping_origin_zip: e.target.value })} className={inputClass} />
        </label>
        <label className="block font-body text-sm text-gold">
          Return policy
          <textarea value={form.return_policy} onChange={(e) => setForm({ ...form, return_policy: e.target.value })} className={inputClass} rows={3} />
        </label>
        <label className="block font-body text-sm text-gold">
          Shipping policy
          <textarea value={form.shipping_policy} onChange={(e) => setForm({ ...form, shipping_policy: e.target.value })} className={inputClass} rows={3} />
        </label>
        <label className="block font-body text-sm text-gold">
          Customer service email
          <input type="email" value={form.customer_service_email} onChange={(e) => setForm({ ...form, customer_service_email: e.target.value })} className={inputClass} />
        </label>
        <fieldset>
          <legend className="font-body text-sm text-gold">Payout method</legend>
          <label className="mt-2 flex items-center gap-2 font-body text-sm text-cream">
            <input type="radio" checked={form.payout_method === "stripe_express"} onChange={() => setForm({ ...form, payout_method: "stripe_express" })} />
            Stripe Express (recommended)
          </label>
        </fieldset>
        <GoldButton label="Save settings" type="submit" variant="solid" />
        <p className="font-body text-xs text-gold-body">
          Connect Stripe Express in your Gold Partner onboarding to receive split payouts from multi-vendor orders.
        </p>
      </form>
    </DashboardShell>
  );
}

const inputClass =
  "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold";
