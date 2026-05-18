"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    short_description: "",
    category: "hair_color",
    brand: "",
    price: "",
    compare_at_price: "",
    inventory_count: "0",
    pro_only: false,
    pro_only_categories: "",
    active: true,
    ingredients: "",
    usage_instructions: "",
    warnings: "",
    weight_oz: "16",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Product creation uses Supabase client from browser when auth is wired
    setSaving(false);
    router.push("/dashboard/storefront/products");
  }

  return (
    <DashboardShell title="Add product" nav={STOREFRONT_NAV}>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Field label="Product name" required>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
          />
        </Field>
        <Field label="URL slug" required>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={inputClass}
            required
          />
        </Field>
        <Field label="SKU" required>
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} required />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            <option value="hair_color">Hair Color</option>
            <option value="hair_tools">Hair Tools</option>
            <option value="skincare">Skincare</option>
            <option value="nail_supplies">Nail Supplies</option>
          </select>
        </Field>
        <Field label="Price (USD)" required>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} required />
        </Field>
        <Field label="Compare at price">
          <input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Inventory count">
          <input type="number" value={form.inventory_count} onChange={(e) => setForm({ ...form, inventory_count: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Weight (oz)">
          <input type="number" value={form.weight_oz} onChange={(e) => setForm({ ...form, weight_oz: e.target.value })} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input type="checkbox" checked={form.pro_only} onChange={(e) => setForm({ ...form, pro_only: e.target.checked })} className="text-gold" />
          Pro-only (requires license verification)
        </label>
        {form.pro_only && (
          <Field label="Allowed pro categories (comma-separated)">
            <input value={form.pro_only_categories} onChange={(e) => setForm({ ...form, pro_only_categories: e.target.value })} className={inputClass} placeholder="hair, nail, lash" />
          </Field>
        )}
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={4} />
        </Field>
        <Field label="Ingredients">
          <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className={inputClass} rows={2} />
        </Field>
        <Field label="Usage instructions">
          <textarea value={form.usage_instructions} onChange={(e) => setForm({ ...form, usage_instructions: e.target.value })} className={inputClass} rows={2} />
        </Field>
        <Field label="Warnings">
          <textarea value={form.warnings} onChange={(e) => setForm({ ...form, warnings: e.target.value })} className={inputClass} rows={2} />
        </Field>
        <GoldButton label={saving ? "Saving…" : "Create product"} type="submit" variant="solid" />
      </form>
    </DashboardShell>
  );
}

const inputClass =
  "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-body text-sm text-gold">
      {label}
      {required && <span className="text-teal"> *</span>}
      {children}
    </label>
  );
}
