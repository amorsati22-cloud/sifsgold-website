"use client";

import { createClient } from "@/lib/supabase/client";
import { PHOTO_STUDIO_BUCKET } from "@/lib/photo-studio/constants";

export async function uploadPhotoStudioFile(
  userId: string,
  file: Blob | File,
  suffix = "original",
): Promise<{ publicUrl: string; path: string } | { error: string }> {
  const supabase = createClient();
  const ext =
    file instanceof File
      ? file.name.split(".").pop() ?? "jpg"
      : file.type.includes("png")
        ? "png"
        : "jpg";
  const path = `${userId}/${Date.now()}-${suffix}.${ext}`;

  const { error } = await supabase.storage.from(PHOTO_STUDIO_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file instanceof File ? file.type : "image/jpeg",
  });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(PHOTO_STUDIO_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}
