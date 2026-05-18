import { toPng, toJpeg } from "html-to-image";

export type ExportFormat = "png" | "jpg" | "webp";
export type ExportPreset = "web" | "print" | "social";

const PRESET_QUALITY: Record<ExportPreset, { jpg: number; pngPixelRatio: number }> = {
  web: { jpg: 0.85, pngPixelRatio: 1 },
  print: { jpg: 0.95, pngPixelRatio: 2 },
  social: { jpg: 0.9, pngPixelRatio: 1.5 },
};

export async function exportElementToBlob(
  element: HTMLElement,
  format: ExportFormat,
  preset: ExportPreset = "social",
): Promise<Blob> {
  const { jpg, pngPixelRatio } = PRESET_QUALITY[preset];
  const options = {
    pixelRatio: pngPixelRatio,
    cacheBust: true,
    skipFonts: false,
  };

  const dataUrl =
    format === "jpg"
      ? await toJpeg(element, { ...options, quality: jpg })
      : await toPng(element, options);

  const res = await fetch(dataUrl);
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  preset: ExportPreset = "social",
): Promise<Blob> {
  const quality = PRESET_QUALITY[preset].jpg;
  const mime = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      mime,
      format === "jpg" ? quality : undefined,
    );
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function composeImageWithWatermark(
  imageUrl: string,
  watermark: {
    text: string;
    position: string;
    opacity: number;
    fontColor: string;
    fontFamily: string;
    backgroundBlur: boolean;
  },
): Promise<HTMLCanvasElement> {
  const img = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.drawImage(img, 0, 0);
  const padding = Math.max(16, Math.round(canvas.width * 0.02));
  const fontSize = Math.max(14, Math.round(canvas.width * 0.035));
  ctx.font = `600 ${fontSize}px ${watermark.fontFamily}, sans-serif`;
  const metrics = ctx.measureText(watermark.text);
  const boxW = metrics.width + padding * 2;
  const boxH = fontSize + padding * 1.5;

  let x = padding;
  let y = canvas.height - boxH - padding;
  if (watermark.position.includes("right")) x = canvas.width - boxW - padding;
  if (watermark.position.includes("top")) y = padding;
  if (watermark.position === "center") {
    x = (canvas.width - boxW) / 2;
    y = (canvas.height - boxH) / 2;
  }

  if (watermark.backgroundBlur) {
    ctx.fillStyle = `rgba(4, 16, 30, ${watermark.opacity * 0.6})`;
    ctx.fillRect(x, y, boxW, boxH);
  }

  ctx.fillStyle = watermark.fontColor;
  ctx.globalAlpha = watermark.opacity;
  ctx.fillText(watermark.text, x + padding, y + fontSize + padding * 0.25);
  ctx.globalAlpha = 1;

  return canvas;
}
