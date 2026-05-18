"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ProIntakeTemplate } from "@/types/pro-ops";

const DEFAULT_TEMPLATES = [
  {
    name: "First-time client",
    description: "Allergies, medications, and goals",
    service_category: null,
    fields: [
      { id: "allergies", label: "Known allergies", type: "textarea", required: true },
      { id: "medications", label: "Current medications", type: "textarea", required: false },
      { id: "goals", label: "Service goals", type: "textarea", required: true },
    ],
  },
  {
    name: "Color services",
    description: "Required for color, bleach, and chemical services",
    service_category: "hair",
    fields: [
      { id: "patch_test", label: "Patch test within 48h?", type: "checkbox", required: true },
      { id: "previous_color", label: "Previous color history", type: "textarea", required: true },
    ],
  },
];

export function IntakeFormsManager({ templates, proId }: { templates: ProIntakeTemplate[]; proId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function seedTemplate(template: (typeof DEFAULT_TEMPLATES)[0]) {
    setLoading(true);
    await fetch("/api/pro/intake-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_id: proId, ...template }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-heading text-lg text-gold">Your forms</h2>
        {templates.length === 0 ? (
          <p className="mt-2 font-body text-sm text-gold-body">No custom forms yet. Add a template below.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {templates.map((t) => (
              <li key={t.id} className="rounded-brand-lg border border-gold/15 bg-navy/50 p-4">
                <p className="font-heading text-cream">{t.name}</p>
                {t.description ? (
                  <p className="mt-1 font-body text-sm text-gold-body">{t.description}</p>
                ) : null}
                <p className="mt-2 font-body text-xs text-cream/60">
                  {t.fields.length} fields
                  {t.service_category ? ` · ${t.service_category}` : ""}
                  {t.is_default ? " · Default" : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-heading text-lg text-gold">Starter templates</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {DEFAULT_TEMPLATES.map((t) => (
            <div key={t.name} className="rounded-brand-lg border border-gold/15 bg-navy/40 p-4">
              <p className="font-heading text-cream">{t.name}</p>
              <p className="mt-1 font-body text-sm text-gold-body">{t.description}</p>
              <GoldButton
                label={loading ? "…" : "Add template"}
                onClick={() => void seedTemplate(t)}
                variant="outlined"
                size="sm"
                className={`mt-3 ${loading ? "pointer-events-none opacity-60" : ""}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
