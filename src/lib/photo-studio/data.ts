import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PhotoStudioAsset, WatermarkTemplate } from "@/types/photo-studio";

export async function getPhotoStudioUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getRecentAssets(userId: string, limit = 12): Promise<PhotoStudioAsset[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("photo_studio_assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as PhotoStudioAsset[];
}

export async function getAssetById(
  userId: string,
  assetId: string,
): Promise<PhotoStudioAsset | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("photo_studio_assets")
    .select("*")
    .eq("id", assetId)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as PhotoStudioAsset) ?? null;
}

export async function getWatermarkTemplates(userId: string): Promise<WatermarkTemplate[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("watermark_templates")
    .select("*")
    .eq("user_id", userId)
    .order("default_template", { ascending: false })
    .order("name");
  return (data ?? []) as WatermarkTemplate[];
}

export async function getDefaultWatermark(userId: string): Promise<WatermarkTemplate | null> {
  const templates = await getWatermarkTemplates(userId);
  return templates.find((t) => t.default_template) ?? templates[0] ?? null;
}

export async function getCompletedAppointmentsForPro(proId: string) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("appointments")
    .select(
      "id, client_id, status, client_consent_for_photos, photo_consent_requested_at, photo_consent_granted_at, completed_at",
    )
    .eq("pro_id", proId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(20);
  return data ?? [];
}
