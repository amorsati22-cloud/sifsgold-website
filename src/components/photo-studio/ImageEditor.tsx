"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { createPhotoAsset, updatePhotoAsset } from "@/lib/photo-studio/actions";
import {
  canvasToBlob,
  composeImageWithWatermark,
  downloadBlob,
  loadImage,
} from "@/lib/photo-studio/exports";
import { removeImageBackground, revokeBgRemovalUrl } from "@/lib/photo-studio/bg-removal";
import { uploadPhotoStudioFile } from "@/lib/photo-studio/upload";
import { CROP_PRESETS } from "@/lib/photo-studio/constants";
import { GoldButton } from "@/components/ui/GoldButton";
import type { EditState, PhotoStudioAsset, WatermarkTemplate } from "@/types/photo-studio";

type Props = {
  userId: string;
  asset: PhotoStudioAsset | null;
  isNew: boolean;
  templates: WatermarkTemplate[];
};

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export function ImageEditor({ userId, asset, isNew, templates }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState(asset?.edited_image_url || asset?.original_image_url || "");
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [edit, setEdit] = useState<EditState>(asset?.edit_state ?? { brightness: 100, contrast: 100, saturation: 100, rotation: 0 });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templateId, setTemplateId] = useState(templates.find((t) => t.default_template)?.id ?? templates[0]?.id ?? "");
  const [assetId, setAssetId] = useState(asset?.id ?? null);
  const [bgPending, setBgPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filterStyle = {
    filter: `brightness(${edit.brightness ?? 100}%) contrast(${edit.contrast ?? 100}%) saturate(${edit.saturation ?? 100}%)`,
    transform: `rotate(${edit.rotation ?? 0}deg) scaleX(${edit.flipH ? -1 : 1}) scaleY(${edit.flipV ? -1 : 1})`,
  };

  function pushHistory(url: string) {
    setHistory((h) => [...h.slice(0, historyIndex + 1), url]);
    setHistoryIndex((i) => i + 1);
    setSrc(url);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const next = historyIndex - 1;
    setHistoryIndex(next);
    setSrc(history[next]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const next = historyIndex + 1;
    setHistoryIndex(next);
    setSrc(history[next]);
  }

  async function onUpload(file: File) {
    const up = await uploadPhotoStudioFile(userId, file);
    if ("error" in up) {
      setMessage(up.error);
      return;
    }
    pushHistory(up.publicUrl);
    if (isNew && !assetId) {
      const created = await createPhotoAsset({
        type: "single",
        name: file.name,
        originalImageUrl: up.publicUrl,
      });
      if (created.ok) setAssetId(created.id);
    }
  }

  async function applyBgRemoval() {
    if (!src) return;
    setBgPending(true);
    const result = await removeImageBackground(src);
    setBgPending(false);
    if ("error" in result) {
      setMessage(result.error);
      return;
    }
    pushHistory(result.url);
    setMessage("Background removed.");
  }

  async function applyWatermark() {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl || !src) return;
    const canvas = await composeImageWithWatermark(src, {
      text: tpl.text_content,
      position: tpl.position,
      opacity: Number(tpl.opacity),
      fontColor: tpl.font_color,
      fontFamily: tpl.font_family,
      backgroundBlur: tpl.background_blur,
    });
    const blob = await canvasToBlob(canvas, "png", "social");
    const up = await uploadPhotoStudioFile(userId, blob, "watermarked");
    if ("error" in up) {
      setMessage(up.error);
      return;
    }
    pushHistory(up.publicUrl);
    if (assetId) {
      await updatePhotoAsset(assetId, { editedImageUrl: up.publicUrl, watermarkApplied: true, editState: edit });
    }
    setMessage("Watermark applied.");
  }

  async function saveEdits() {
    if (!assetId) {
      setMessage("Upload an image first.");
      return;
    }
    await updatePhotoAsset(assetId, {
      editedImageUrl: src,
      editState: edit,
      backgroundRemoved: src.includes("bg-removed"),
    });
    setMessage("Saved.");
    router.refresh();
  }

  async function exportImage(format: "png" | "jpg") {
    if (!src) return;
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = filterStyle.filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(((edit.rotation ?? 0) * Math.PI) / 180);
    ctx.scale(edit.flipH ? -1 : 1, edit.flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    const blob = await canvasToBlob(canvas, format, "social");
    downloadBlob(blob, `edit.${format}`);
    if (assetId) {
      await updatePhotoAsset(assetId, {
        exportEntry: { at: new Date().toISOString(), format, preset: "social" },
      });
    }
  }

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (!aspect) return;
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    },
    [aspect],
  );

  useEffect(() => {
    return () => {
      history.forEach((u) => {
        if (u.startsWith("blob:")) revokeBgRemovalUrl(u);
      });
    };
  }, [history]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-4">
        <h2 className="font-heading text-lg text-gold">Tools</h2>

        <label className="block font-body text-sm text-cream">
          Upload
          <input type="file" accept="image/*" className="mt-1 w-full text-sm" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>

        <fieldset>
          <legend className="mb-2 font-body text-xs text-goldBody">Crop preset</legend>
          <div className="flex flex-wrap gap-1">
            {CROP_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAspect(p.aspect)}
                className={`rounded px-2 py-1 font-body text-xs ${aspect === p.aspect ? "bg-gold/20 text-gold" : "text-cream/70"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        <Level label="Brightness" value={edit.brightness ?? 100} onChange={(v) => setEdit((e) => ({ ...e, brightness: v }))} />
        <Level label="Contrast" value={edit.contrast ?? 100} onChange={(v) => setEdit((e) => ({ ...e, contrast: v }))} />
        <Level label="Saturation" value={edit.saturation ?? 100} onChange={(v) => setEdit((e) => ({ ...e, saturation: v }))} />

        <div className="flex gap-2">
          <button type="button" className="text-sm text-gold" onClick={() => setEdit((e) => ({ ...e, rotation: (e.rotation ?? 0) + 90 }))}>
            Rotate 90°
          </button>
          <button type="button" className="text-sm text-gold" onClick={() => setEdit((e) => ({ ...e, flipH: !e.flipH }))}>
            Flip H
          </button>
          <button type="button" className="text-sm text-gold" onClick={() => setEdit((e) => ({ ...e, flipV: !e.flipV }))}>
            Flip V
          </button>
        </div>

        <GoldButton label={bgPending ? "Removing…" : "Remove background"} variant="outlined" onClick={applyBgRemoval} />

        {templates.length > 0 ? (
          <div>
            <label htmlFor="wm-tpl" className="font-body text-xs text-cream">
              Watermark
            </label>
            <select
              id="wm-tpl"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-navy-deep px-2 py-2 text-sm text-cream"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <GoldButton label="Apply watermark" variant="outlined" className="mt-2 w-full" onClick={applyWatermark} />
          </div>
        ) : null}

        <div className="flex gap-2">
          <button type="button" onClick={undo} disabled={historyIndex <= 0} className="text-sm text-gold disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} className="text-sm text-gold disabled:opacity-40">
            Redo
          </button>
        </div>

        <GoldButton label="Save" variant="solid" onClick={saveEdits} />
        <GoldButton label="Export PNG" variant="outlined" onClick={() => exportImage("png")} />
        <GoldButton label="Export JPG" variant="outlined" onClick={() => exportImage("jpg")} />
      </aside>

      <div className="rounded-brand-lg border border-gold/15 bg-navy-deep/50 p-4">
        {src ? (
          <ReactCrop crop={crop} onChange={setCrop} aspect={aspect}>
            <img
              ref={imgRef}
              src={src}
              alt="Edit preview"
              onLoad={onImageLoad}
              style={{ maxWidth: "100%", ...filterStyle }}
              className="mx-auto"
            />
          </ReactCrop>
        ) : (
          <p className="py-20 text-center font-body text-cream/60">Upload an image to start editing.</p>
        )}
      </div>

      {message ? <p className="font-body text-sm text-teal lg:col-span-2">{message}</p> : null}
    </div>
  );
}

function Level({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block font-body text-xs text-cream">
      {label} ({value}%)
      <input
        type="range"
        min={50}
        max={150}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-gold"
      />
    </label>
  );
}
