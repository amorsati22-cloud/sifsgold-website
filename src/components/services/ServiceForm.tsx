"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { groupCategoriesByParent, type CategoryGroup } from "@/lib/services/categories";
import { CANCELLATION_POLICIES, PREREQUISITE_OPTIONS } from "@/lib/services/constants";
import type { PriceType, ServiceWithAddons } from "@/types/services";
import type { ServiceCategoryRow } from "@/types/services";

export type AddonDraft = {
  id?: string;
  name: string;
  description: string;
  duration_minutes: string;
  price_amount: string;
};

export type ServiceFormValues = {
  name: string;
  category: string;
  description: string;
  duration_minutes: string;
  price_amount: string;
  price_type: PriceType;
  price_high: string;
  requires_consultation: boolean;
  consultation_required_for_first_visit: boolean;
  max_per_day: string;
  prerequisites: string[];
  custom_prerequisite: string;
  aftercare_instructions: string;
  cancellation_policy: string;
  deposit_required: boolean;
  deposit_amount: string;
  bookable_online: boolean;
  addons: AddonDraft[];
};

function emptyAddon(): AddonDraft {
  return { name: "", description: "", duration_minutes: "", price_amount: "" };
}

function serviceToForm(service: ServiceWithAddons | null): ServiceFormValues {
  if (!service) {
    return {
      name: "",
      category: "hair_cut",
      description: "",
      duration_minutes: "60",
      price_amount: "",
      price_type: "fixed",
      price_high: "",
      requires_consultation: false,
      consultation_required_for_first_visit: false,
      max_per_day: "",
      prerequisites: [],
      custom_prerequisite: "",
      aftercare_instructions: "",
      cancellation_policy: "24h_full_refund",
      deposit_required: false,
      deposit_amount: "",
      bookable_online: true,
      addons: [],
    };
  }
  return {
    name: service.name,
    category: service.category ?? "other",
    description: service.description ?? "",
    duration_minutes: String(service.duration_minutes),
    price_amount: String(service.price_amount),
    price_type: service.price_type,
    price_high: service.price_high != null ? String(service.price_high) : "",
    requires_consultation: service.requires_consultation,
    consultation_required_for_first_visit: service.consultation_required_for_first_visit,
    max_per_day: service.max_per_day != null ? String(service.max_per_day) : "",
    prerequisites: service.prerequisites ?? [],
    custom_prerequisite: "",
    aftercare_instructions: service.aftercare_instructions ?? "",
    cancellation_policy: service.cancellation_policy ?? "24h_full_refund",
    deposit_required: service.deposit_required,
    deposit_amount: service.deposit_amount != null ? String(service.deposit_amount) : "",
    bookable_online: service.bookable_online,
    addons: service.addons.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description ?? "",
      duration_minutes: a.duration_minutes != null ? String(a.duration_minutes) : "",
      price_amount: String(a.price_amount),
    })),
  };
}

type ServiceFormProps = {
  proId: string;
  categories: ServiceCategoryRow[];
  initial?: ServiceWithAddons | null;
  serviceId?: string;
};

export function ServiceForm({ proId, categories, initial = null, serviceId }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceFormValues>(() => serviceToForm(initial));
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const categoryGroups: CategoryGroup[] = groupCategoriesByParent(categories);
  const flatCategories = categoryGroups.flatMap((g) => [g.parent, ...g.children]);

  function update<K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function togglePrerequisite(id: string) {
    setForm((f) => ({
      ...f,
      prerequisites: f.prerequisites.includes(id)
        ? f.prerequisites.filter((p) => p !== id)
        : [...f.prerequisites, id],
    }));
  }

  function addCustomPrerequisite() {
    const tag = form.custom_prerequisite.trim().toLowerCase().replace(/\s+/g, "_");
    if (!tag || form.prerequisites.includes(tag)) return;
    update("prerequisites", [...form.prerequisites, tag]);
    update("custom_prerequisite", "");
  }

  async function persist(publish: boolean) {
    setStatus("saving");
    setError(null);

    if (!form.name.trim()) {
      setStatus("error");
      setError("Service name is required.");
      return;
    }
    if (!form.price_amount && form.price_type !== "custom_quote") {
      setStatus("error");
      setError("Price is required.");
      return;
    }

    const supabase = createClient();
    const prerequisites = [...form.prerequisites];
    const payload = {
      pro_id: proId,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || null,
      duration_minutes: parseInt(form.duration_minutes, 10) || 60,
      price_amount: form.price_type === "custom_quote" ? 0 : parseFloat(form.price_amount) || 0,
      price_type: form.price_type,
      price_high: form.price_high ? parseFloat(form.price_high) : null,
      requires_consultation: form.requires_consultation,
      consultation_required_for_first_visit: form.consultation_required_for_first_visit,
      max_per_day: form.max_per_day ? parseInt(form.max_per_day, 10) : null,
      prerequisites,
      aftercare_instructions: form.aftercare_instructions.trim() || null,
      cancellation_policy: form.cancellation_policy || null,
      deposit_required: form.deposit_required,
      deposit_amount: form.deposit_required && form.deposit_amount ? parseFloat(form.deposit_amount) : null,
      visible: publish,
      bookable_online: form.bookable_online,
    };

    try {
      let id = serviceId;
      if (id) {
        const { error: updateError } = await supabase.from("services").update(payload).eq("id", id);
        if (updateError) throw updateError;
        await supabase.from("service_addons").delete().eq("service_id", id);
      } else {
        const { data, error: insertError } = await supabase
          .from("services")
          .insert({ ...payload, display_order: 0 })
          .select("id")
          .single();
        if (insertError || !data) throw insertError;
        id = data.id as string;
      }

      const addonRows = form.addons
        .filter((a) => a.name.trim())
        .map((a, i) => ({
          service_id: id!,
          name: a.name.trim(),
          description: a.description.trim() || null,
          duration_minutes: a.duration_minutes ? parseInt(a.duration_minutes, 10) : null,
          price_amount: parseFloat(a.price_amount) || 0,
          display_order: i,
        }));

      if (addonRows.length > 0) {
        const { error: addonError } = await supabase.from("service_addons").insert(addonRows);
        if (addonError) throw addonError;
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Could not save service. Check your connection and try again.");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 font-body text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
  const labelClass = "block font-body text-sm text-cream";

  return (
    <form
      className="mx-auto max-w-2xl space-y-6 pb-12"
      onSubmit={(e) => {
        e.preventDefault();
        persist(true);
      }}
    >
      <label className={labelClass}>
        Service name
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClass}
          placeholder="Balayage, Men's Cut + Beard Trim…"
        />
      </label>

      <label className={labelClass}>
        Category
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className={inputClass}
        >
          {flatCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent_category ? `  ${c.label}` : c.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Description
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Duration (minutes)
          <input
            type="number"
            min={5}
            step={5}
            required
            value={form.duration_minutes}
            onChange={(e) => update("duration_minutes", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Price type
          <select
            value={form.price_type}
            onChange={(e) => update("price_type", e.target.value as PriceType)}
            className={inputClass}
          >
            <option value="fixed">Fixed price</option>
            <option value="starting_at">Starting at</option>
            <option value="custom_quote">Custom quote</option>
          </select>
        </label>
      </div>

      {form.price_type !== "custom_quote" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Price ($)
            <input
              type="number"
              min={0}
              step={0.01}
              required
              value={form.price_amount}
              onChange={(e) => update("price_amount", e.target.value)}
              className={inputClass}
            />
          </label>
          {form.price_type === "fixed" ? (
            <label className={labelClass}>
              Price high ($) — optional range
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price_high}
                onChange={(e) => update("price_high", e.target.value)}
                className={inputClass}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="font-body text-sm font-medium text-gold">Prerequisites</legend>
        <div className="flex flex-wrap gap-2">
          {PREREQUISITE_OPTIONS.map((p) => (
            <label
              key={p.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/20 px-3 py-1 font-body text-xs text-cream"
            >
              <input
                type="checkbox"
                checked={form.prerequisites.includes(p.id)}
                onChange={() => togglePrerequisite(p.id)}
                className="h-3.5 w-3.5 rounded border-gold/30 text-gold"
              />
              {p.label}
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={form.custom_prerequisite}
            onChange={(e) => update("custom_prerequisite", e.target.value)}
            placeholder="Custom prerequisite"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addCustomPrerequisite}
            className="shrink-0 rounded-brand-md border border-gold/30 px-3 py-2 text-sm text-gold"
          >
            Add
          </button>
        </div>
      </fieldset>

      <label className={labelClass}>
        Aftercare instructions
        <textarea
          value={form.aftercare_instructions}
          onChange={(e) => update("aftercare_instructions", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Cancellation policy
        <select
          value={form.cancellation_policy}
          onChange={(e) => update("cancellation_policy", e.target.value)}
          className={inputClass}
        >
          {CANCELLATION_POLICIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-3 rounded-brand-md border border-gold/10 p-4">
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={form.deposit_required}
            onChange={(e) => update("deposit_required", e.target.checked)}
          />
          Deposit required
        </label>
        {form.deposit_required ? (
          <label className={labelClass}>
            Deposit amount ($)
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.deposit_amount}
              onChange={(e) => update("deposit_amount", e.target.value)}
              className={inputClass}
            />
          </label>
        ) : null}
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={form.requires_consultation}
            onChange={(e) => update("requires_consultation", e.target.checked)}
          />
          Requires consultation before booking
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={form.consultation_required_for_first_visit}
            onChange={(e) => update("consultation_required_for_first_visit", e.target.checked)}
          />
          Consultation required for first visit
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={form.bookable_online}
            onChange={(e) => update("bookable_online", e.target.checked)}
          />
          Bookable online
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-heading text-lg text-gold">Add-ons</legend>
        {form.addons.map((addon, index) => (
          <div key={index} className="rounded-brand-md border border-gold/10 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="font-body text-xs text-gold-body">Add-on {index + 1}</span>
              <button
                type="button"
                onClick={() =>
                  update(
                    "addons",
                    form.addons.filter((_, i) => i !== index),
                  )
                }
                className="text-xs text-red-300"
              >
                Remove
              </button>
            </div>
            <input
              placeholder="Name"
              value={addon.name}
              onChange={(e) => {
                const next = [...form.addons];
                next[index] = { ...addon, name: e.target.value };
                update("addons", next);
              }}
              className={inputClass}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="number"
                placeholder="Extra minutes"
                value={addon.duration_minutes}
                onChange={(e) => {
                  const next = [...form.addons];
                  next[index] = { ...addon, duration_minutes: e.target.value };
                  update("addons", next);
                }}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={addon.price_amount}
                onChange={(e) => {
                  const next = [...form.addons];
                  next[index] = { ...addon, price_amount: e.target.value };
                  update("addons", next);
                }}
                className={inputClass}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update("addons", [...form.addons, emptyAddon()])}
          className="rounded-full border border-gold/30 px-4 py-2 font-body text-sm text-gold"
        >
          + Add add-on
        </button>
      </fieldset>

      {error ? <p className="text-sm text-red-300" role="alert">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={status === "saving"}
          onClick={() => persist(false)}
          className="rounded-full border border-gold/40 px-6 py-2.5 font-body text-sm text-gold hover:bg-gold/10 disabled:opacity-60"
        >
          Save as draft
        </button>
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-navy hover:bg-gold-light disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/services")}
          className="font-body text-sm text-cream/60 underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
