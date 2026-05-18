"use client";

const IMGLY_CDN =
  "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.6.0/dist/index.mjs";
const IMGLY_DATA_CDN =
  "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.6.0/dist/";

type RemovalModule = typeof import("@imgly/background-removal");

let removalModule: RemovalModule | null = null;

export function isBgRemovalSupported(): boolean {
  if (typeof window === "undefined") return false;
  return typeof WebAssembly !== "undefined" && typeof createImageBitmap !== "undefined";
}

async function loadRemovalModule(): Promise<RemovalModule> {
  if (removalModule) return removalModule;
  removalModule = (await import(
    /* webpackIgnore: true */
    IMGLY_CDN
  )) as RemovalModule;
  return removalModule;
}

export async function removeImageBackground(
  source: Blob | string,
): Promise<{ blob: Blob; url: string } | { error: string }> {
  if (!isBgRemovalSupported()) {
    return {
      error:
        "Background removal is not supported in this browser. Try Chrome or Edge on desktop.",
    };
  }

  try {
    const mod = await loadRemovalModule();
    const input =
      typeof source === "string" ? source : URL.createObjectURL(source);
    const blob = await mod.removeBackground(input, {
      publicPath: IMGLY_DATA_CDN,
      output: { format: "image/png", quality: 0.9 },
      device: "cpu",
      model: "small",
    });
    if (typeof source !== "string") URL.revokeObjectURL(input);
    const url = URL.createObjectURL(blob);
    return { blob, url };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Background removal failed";
    return { error: message };
  }
}

export function revokeBgRemovalUrl(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}
