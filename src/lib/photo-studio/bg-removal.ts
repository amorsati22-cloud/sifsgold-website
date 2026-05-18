"use client";

let removalModule: typeof import("@imgly/background-removal") | null = null;

export function isBgRemovalSupported(): boolean {
  if (typeof window === "undefined") return false;
  return typeof WebAssembly !== "undefined" && typeof createImageBitmap !== "undefined";
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
    if (!removalModule) {
      removalModule = await import("@imgly/background-removal");
    }
    const input =
      typeof source === "string"
        ? source
        : URL.createObjectURL(source);
    const blob = await removalModule.removeBackground(input, {
      output: { format: "image/png", quality: 0.9 },
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
