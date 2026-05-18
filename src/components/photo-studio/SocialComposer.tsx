"use client";

import { useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { BRAND_PALETTE, FONT_OPTIONS, SOCIAL_TEMPLATES } from "@/lib/photo-studio/constants";
import { downloadBlob, exportElementToBlob } from "@/lib/photo-studio/exports";
import { uploadPhotoStudioFile } from "@/lib/photo-studio/upload";
import { createPhotoAsset } from "@/lib/photo-studio/actions";
import { GoldButton } from "@/components/ui/GoldButton";
import { GlassInput } from "@/components/ui/GlassInput";

export function SocialComposer({ userId }: { userId: string }) {
  const theme = useTheme();
  const exportRef = useRef<HTMLDivElement>(null);
  const [templateId, setTemplateId] = useState(SOCIAL_TEMPLATES[0].id);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [fontId, setFontId] = useState("playfair");
  const [color, setColor] = useState(BRAND_PALETTE[0].hex);
  const [message, setMessage] = useState<string | null>(null);

  const tpl = SOCIAL_TEMPLATES.find((t) => t.id === templateId) ?? SOCIAL_TEMPLATES[0];
  const font = FONT_OPTIONS.find((f) => f.id === fontId) ?? FONT_OPTIONS[0];

  async function onUpload(file: File) {
    const up = await uploadPhotoStudioFile(userId, file, "social");
    if ("error" in up) {
      setMessage(up.error);
      return;
    }
    setImageUrl(up.publicUrl);
  }

  async function handleExport() {
    if (!exportRef.current) return;
    const blob = await exportElementToBlob(exportRef.current, "png", "social");
    downloadBlob(blob, `${tpl.id}.png`);
    if (imageUrl) {
      await createPhotoAsset({
        type: "social_post",
        name: tpl.label,
        originalImageUrl: imageUrl,
      });
    }
    setMessage(`Exported ${tpl.width}×${tpl.height}px PNG.`);
  }

  const scale = Math.min(1, 400 / tpl.width);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {SOCIAL_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplateId(t.id)}
            className={`rounded-brand-md px-3 py-2 font-body text-xs ${templateId === t.id ? "bg-gold/20 text-gold" : "text-cream/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className="block font-body text-sm text-cream">
        Photo
        <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </label>

      <GlassInput value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline text" aria-label="Headline" />

      <div className="flex flex-wrap gap-4">
        <select
          value={fontId}
          onChange={(e) => setFontId(e.target.value)}
          className="rounded border border-white/20 bg-navy-deep px-3 py-2 text-sm text-cream"
          aria-label="Font"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <div className="flex gap-1" role="list" aria-label="Brand colors">
          {BRAND_PALETTE.map((c) => (
            <button
              key={c.hex}
              type="button"
              title={c.name}
              onClick={() => setColor(c.hex)}
              className={`h-8 w-8 rounded-full border-2 ${color === c.hex ? "border-gold" : "border-transparent"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div
        ref={exportRef}
        className="relative overflow-hidden rounded-brand-md border border-gold/20 bg-navy-deep"
        style={{
          width: tpl.width * scale,
          height: tpl.height * scale,
          backgroundColor: theme.colors.navyDeep,
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {headline ? (
          <p
            className="absolute bottom-4 left-4 right-4 text-center font-bold drop-shadow-lg"
            style={{ fontFamily: font.css, color, fontSize: 24 * scale }}
          >
            {headline}
          </p>
        ) : null}
      </div>

      <p className="font-body text-xs text-goldBody">
        Export: {tpl.width}×{tpl.height}px — optimized for {tpl.label}
      </p>

      <GoldButton label="Export PNG" variant="solid" onClick={handleExport} />

      {message ? <p className="font-body text-sm text-teal">{message}</p> : null}
    </div>
  );
}
