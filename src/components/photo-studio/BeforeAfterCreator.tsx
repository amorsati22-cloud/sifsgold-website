"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { createPhotoAsset, saveAssetToPortfolio, updatePhotoAsset } from "@/lib/photo-studio/actions";
import { downloadBlob, exportElementToBlob } from "@/lib/photo-studio/exports";
import { uploadPhotoStudioFile } from "@/lib/photo-studio/upload";
import { GoldButton } from "@/components/ui/GoldButton";
import { GlassInput } from "@/components/ui/GlassInput";

const ReactCompareImage = dynamic(() => import("react-compare-image"), { ssr: false });

export function BeforeAfterCreator({ userId }: { userId: string }) {
  const theme = useTheme();
  const exportRef = useRef<HTMLDivElement>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [beforeLabel, setBeforeLabel] = useState("Before");
  const [afterLabel, setAfterLabel] = useState("After");
  const [sliderPct, setSliderPct] = useState(50);
  const [watermarkOn, setWatermarkOn] = useState(true);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleFile(which: "before" | "after", file: File) {
    setPending(true);
    const up = await uploadPhotoStudioFile(userId, file, which);
    setPending(false);
    if ("error" in up) {
      setMessage(up.error);
      return;
    }
    if (which === "before") setBeforeUrl(up.publicUrl);
    else setAfterUrl(up.publicUrl);
  }

  async function persistAsset() {
    if (!beforeUrl || !afterUrl) return null;
    if (assetId) return assetId;
    const result = await createPhotoAsset({
      type: "before_after",
      name: "Before / After",
      originalImageUrl: afterUrl,
      beforeImageUrl: beforeUrl,
      afterImageUrl: afterUrl,
      watermarkApplied: watermarkOn,
    });
    if (!result.ok) {
      setMessage(result.error);
      return null;
    }
    setAssetId(result.id);
    return result.id;
  }

  async function handleExport(format: "png" | "jpg") {
    if (!exportRef.current || !beforeUrl || !afterUrl) return;
    setPending(true);
    const blob = await exportElementToBlob(exportRef.current, format, "social");
    downloadBlob(blob, `before-after.${format}`);
    const id = await persistAsset();
    if (id) {
      await updatePhotoAsset(id, {
        exportEntry: { at: new Date().toISOString(), format, preset: "social" },
      });
    }
    setPending(false);
    setMessage("Exported.");
  }

  async function handleSavePortfolio() {
    if (!beforeUrl || !afterUrl) return;
    const alt = prompt("Alt text for accessibility (required):")?.trim();
    if (!alt) {
      setMessage("Alt text is required.");
      return;
    }
    const id = await persistAsset();
    if (!id) return;
    const result = await saveAssetToPortfolio(id, { altText: alt, category: "color" });
    if (!result.ok) setMessage(result.error);
    else setMessage("Saved to portfolio.");
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-body text-sm text-cream">
          Before image
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => e.target.files?.[0] && handleFile("before", e.target.files[0])}
          />
        </label>
        <label className="block font-body text-sm text-cream">
          After image
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => e.target.files?.[0] && handleFile("after", e.target.files[0])}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <GlassInput
          value={beforeLabel}
          onChange={(e) => setBeforeLabel(e.target.value)}
          aria-label="Before label"
          className="max-w-[140px]"
        />
        <GlassInput
          value={afterLabel}
          onChange={(e) => setAfterLabel(e.target.value)}
          aria-label="After label"
          className="max-w-[140px]"
        />
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={watermarkOn}
            onChange={(e) => setWatermarkOn(e.target.checked)}
            className="accent-gold"
          />
          Watermark
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          Slider
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPct}
            onChange={(e) => setSliderPct(Number(e.target.value))}
            className="accent-gold"
            aria-label="Slider position preview"
          />
        </label>
      </div>

      {beforeUrl && afterUrl ? (
        <div
          ref={exportRef}
          className="relative overflow-hidden rounded-brand-lg border border-gold/20 bg-navy-deep"
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <span className="absolute left-3 top-3 z-10 rounded bg-navy/80 px-2 py-1 font-body text-xs text-cream">
            {beforeLabel}
          </span>
          <span className="absolute right-3 top-3 z-10 rounded bg-navy/80 px-2 py-1 font-body text-xs text-cream">
            {afterLabel}
          </span>
          <ReactCompareImage
            leftImage={beforeUrl}
            rightImage={afterUrl}
            sliderPositionPercentage={sliderPct}
            sliderLineColor={theme.colors.gold}
            handleSize={40}
          />
        </div>
      ) : (
        <p className="font-body text-sm text-cream/70">Upload both images to preview the slider.</p>
      )}

      <div className="flex flex-wrap gap-3">
        <GoldButton
          label={pending ? "Working…" : "Export PNG"}
          variant="solid"
          onClick={() => handleExport("png")}
        />
        <GoldButton label="Export JPG" variant="outlined" onClick={() => handleExport("jpg")} />
        <GoldButton label="Save to portfolio" variant="outlined" onClick={handleSavePortfolio} />
      </div>

      <p className="font-body text-xs text-goldBody">
        Animated MP4 export is available in the mobile app. Web exports PNG and JPG. Client consent is
        required before public portfolio use when linked to an appointment.
      </p>

      {message ? (
        <p className="font-body text-sm text-teal" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
