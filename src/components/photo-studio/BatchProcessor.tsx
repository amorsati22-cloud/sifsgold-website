"use client";

import JSZip from "jszip";
import { useState } from "react";
import { composeImageWithWatermark, downloadBlob } from "@/lib/photo-studio/exports";
import { uploadPhotoStudioFile } from "@/lib/photo-studio/upload";
import { createPhotoAsset } from "@/lib/photo-studio/actions";
import { GoldButton } from "@/components/ui/GoldButton";
import type { WatermarkTemplate } from "@/types/photo-studio";

type FileEntry = { file: File; preview: string; processed?: string };

export function BatchProcessor({
  userId,
  templates,
}: {
  userId: string;
  templates: WatermarkTemplate[];
}) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [templateId, setTemplateId] = useState(templates.find((t) => t.default_template)?.id ?? "");
  const [applyWatermark, setApplyWatermark] = useState(true);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onDrop(fileList: FileList | null) {
    if (!fileList) return;
    const next: FileEntry[] = [...files];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) continue;
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setFiles(next);
  }

  async function processAll() {
    if (files.length === 0) return;
    setPending(true);
    const tpl = templates.find((t) => t.id === templateId);
    const zip = new JSZip();
    let done = 0;

    for (const entry of files) {
      let blob: Blob = entry.file;
      if (applyWatermark && tpl) {
        const url = entry.preview;
        const canvas = await composeImageWithWatermark(url, {
          text: tpl.text_content,
          position: tpl.position,
          opacity: Number(tpl.opacity),
          fontColor: tpl.font_color,
          fontFamily: tpl.font_family,
          backgroundBlur: tpl.background_blur,
        });
        blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), "image/jpeg", 0.9),
        );
      }
      const up = await uploadPhotoStudioFile(userId, blob, `batch-${done}`);
      if (!("error" in up)) {
        await createPhotoAsset({
          type: "gallery",
          name: entry.file.name,
          originalImageUrl: up.publicUrl,
          editedImageUrl: up.publicUrl,
          watermarkApplied: applyWatermark && Boolean(tpl),
        });
        zip.file(entry.file.name.replace(/\.[^.]+$/, "") + ".jpg", blob);
      }
      done += 1;
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `photo-studio-batch-${Date.now()}.zip`);
    setPending(false);
    setMessage(`Processed ${done} images. ZIP downloaded.`);
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-brand-lg border-2 border-dashed border-gold/30 bg-navy-deep/50 p-10 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(e.dataTransfer.files);
        }}
      >
        <p className="font-body text-cream/80">Drag and drop multiple images here</p>
        <label className="mt-4 inline-block cursor-pointer font-body text-sm text-gold underline">
          Or browse files
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onDrop(e.target.files)} />
        </label>
      </div>

      {templates.length > 0 ? (
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input type="checkbox" checked={applyWatermark} onChange={(e) => setApplyWatermark(e.target.checked)} className="accent-gold" />
            Apply watermark to all
          </label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="rounded border border-white/20 bg-navy-deep px-3 py-2 text-sm text-cream"
            disabled={!applyWatermark}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {files.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((f, i) => (
            <li key={i} className="relative aspect-square overflow-hidden rounded border border-gold/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.preview} alt="" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      ) : null}

      <GoldButton
        label={pending ? "Processing…" : `Process & download ZIP (${files.length})`}
        variant="solid"
        onClick={processAll}
      />

      {message ? <p className="font-body text-sm text-teal">{message}</p> : null}
    </div>
  );
}
