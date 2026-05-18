"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteWatermarkTemplate,
  saveWatermarkTemplate,
  setDefaultWatermark,
} from "@/lib/photo-studio/actions";
import { GoldButton } from "@/components/ui/GoldButton";
import { GlassInput } from "@/components/ui/GlassInput";
import type { WatermarkTemplate } from "@/types/photo-studio";

const POSITIONS = [
  "bottom_right",
  "bottom_left",
  "top_right",
  "top_left",
  "center",
] as const;

export function WatermarkManager({ templates }: { templates: WatermarkTemplate[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await saveWatermarkTemplate(new FormData(e.currentTarget));
    if (!result.ok) setMessage(result.error);
    else {
      setMessage("Template saved.");
      router.refresh();
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Create template</h2>
        <GlassInput name="name" placeholder="Template name" required />
        <GlassInput name="text_content" placeholder="Watermark text (@username, Sif's Gold, …)" required />
        <select name="position" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-cream" defaultValue="bottom_right">
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p.replace("_", " ")}
            </option>
          ))}
        </select>
        <label className="block font-body text-sm text-cream">
          Opacity (0–1)
          <input name="opacity" type="number" min={0} max={1} step={0.05} defaultValue={0.85} className="mt-1 w-full rounded border border-white/20 bg-navy-deep px-3 py-2 text-cream" />
        </label>
        <GlassInput name="font_color" placeholder="#FFFFFF" defaultValue="#FFFFFF" />
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input type="checkbox" name="background_blur" defaultChecked className="accent-gold" />
          Background blur pill
        </label>
        <GoldButton label="Save template" type="submit" variant="solid" />
      </form>

      <section>
        <h2 className="font-heading text-lg text-gold">Your templates</h2>
        {templates.length === 0 ? (
          <p className="mt-2 font-body text-sm text-cream/70">No templates yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {templates.map((t) => (
              <li key={t.id} className="flex flex-col gap-2 rounded-brand-md border border-gold/15 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-body text-gold">
                    {t.name}
                    {t.default_template ? (
                      <span className="ml-2 text-xs text-teal">Default</span>
                    ) : null}
                  </p>
                  <p className="font-body text-xs text-cream/60">{t.text_content}</p>
                </div>
                <div className="flex gap-2">
                  {!t.default_template ? (
                    <GoldButton
                      label="Set default"
                      variant="outlined"
                      onClick={async () => {
                        await setDefaultWatermark(t.id);
                        router.refresh();
                      }}
                    />
                  ) : null}
                  <GoldButton
                    label="Delete"
                    variant="ghost"
                    onClick={async () => {
                      await deleteWatermarkTemplate(t.id);
                      router.refresh();
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div
        className="relative flex h-40 items-center justify-center overflow-hidden rounded-brand-lg border border-gold/15 bg-gradient-to-br from-navy-deep to-navy"
        aria-hidden
      >
        <span className="rounded bg-navy/70 px-3 py-1 font-body text-sm text-white/90">
          Preview: your watermark appears here on exports
        </span>
      </div>

      {message ? <p className="font-body text-sm text-teal">{message}</p> : null}
    </div>
  );
}
