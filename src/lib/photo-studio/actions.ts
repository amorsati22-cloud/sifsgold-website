"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { requireProDashboardUser } from "@/lib/dashboard";
import type {
  CropData,
  EditState,
  ExportHistoryEntry,
  PhotoAssetType,
  WatermarkPosition,
} from "@/types/photo-studio";

const PHOTO_PATHS = [
  "/dashboard/photo-studio",
  "/dashboard/photo-studio/before-after",
  "/dashboard/photo-studio/social",
  "/dashboard/photo-studio/batch",
  "/dashboard/photo-studio/watermarks",
];

function revalidatePhotoStudio() {
  for (const p of PHOTO_PATHS) revalidatePath(p);
  revalidatePath("/dashboard/photo-studio", "layout");
}

async function requirePro() {
  const { supabase, user } = await requireProDashboardUser();
  return { supabase, userId: user.id };
}

export async function createPhotoAsset(payload: {
  name?: string;
  type: PhotoAssetType;
  originalImageUrl: string;
  editedImageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  watermarkApplied?: boolean;
  backgroundRemoved?: boolean;
  linkedAppointmentId?: string;
  linkedClientConsent?: boolean;
  cropData?: CropData;
  editState?: EditState;
}) {
  const { supabase, userId } = await requirePro();

  const { data, error } = await supabase
    .from("photo_studio_assets")
    .insert({
      user_id: userId,
      name: payload.name ?? null,
      type: payload.type,
      original_image_url: payload.originalImageUrl,
      edited_image_url: payload.editedImageUrl ?? null,
      before_image_url: payload.beforeImageUrl ?? null,
      after_image_url: payload.afterImageUrl ?? null,
      watermark_applied: payload.watermarkApplied ?? false,
      background_removed: payload.backgroundRemoved ?? false,
      linked_appointment_id: payload.linkedAppointmentId ?? null,
      linked_client_consent: payload.linkedClientConsent ?? false,
      crop_data: payload.cropData ?? null,
      edit_state: payload.editState ?? null,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false as const, error: error?.message ?? "Create failed" };
  revalidatePhotoStudio();
  return { ok: true as const, id: data.id as string };
}

export async function updatePhotoAsset(
  assetId: string,
  payload: Partial<{
    name: string;
    editedImageUrl: string;
    watermarkApplied: boolean;
    backgroundRemoved: boolean;
    linkedClientConsent: boolean;
    linkedPortfolioItemId: string;
    cropData: CropData;
    editState: EditState;
    exportEntry: ExportHistoryEntry;
  }>,
) {
  const { supabase, userId } = await requirePro();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.name != null) update.name = payload.name;
  if (payload.editedImageUrl != null) update.edited_image_url = payload.editedImageUrl;
  if (payload.watermarkApplied != null) update.watermark_applied = payload.watermarkApplied;
  if (payload.backgroundRemoved != null) update.background_removed = payload.backgroundRemoved;
  if (payload.linkedClientConsent != null) update.linked_client_consent = payload.linkedClientConsent;
  if (payload.linkedPortfolioItemId != null)
    update.linked_portfolio_item_id = payload.linkedPortfolioItemId;
  if (payload.cropData != null) update.crop_data = payload.cropData;
  if (payload.editState != null) update.edit_state = payload.editState;

  if (payload.exportEntry) {
    const { data: existing } = await supabase
      .from("photo_studio_assets")
      .select("export_history")
      .eq("id", assetId)
      .eq("user_id", userId)
      .single();
    const history = (existing?.export_history as ExportHistoryEntry[]) ?? [];
    update.export_history = [...history, payload.exportEntry];
  }

  const { error } = await supabase
    .from("photo_studio_assets")
    .update(update)
    .eq("id", assetId)
    .eq("user_id", userId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePhotoStudio();
  revalidatePath(`/dashboard/photo-studio/edit/${assetId}`);
  return { ok: true as const };
}

export async function deletePhotoAsset(assetId: string) {
  const { supabase, userId } = await requirePro();
  const { error } = await supabase
    .from("photo_studio_assets")
    .delete()
    .eq("id", assetId)
    .eq("user_id", userId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePhotoStudio();
  return { ok: true as const };
}

export async function saveWatermarkTemplate(formData: FormData) {
  const { supabase, userId } = await requirePro();
  const id = formData.get("id") as string | null;
  const row = {
    user_id: userId,
    name: String(formData.get("name") ?? "My watermark"),
    position: (formData.get("position") as WatermarkPosition) || "bottom_right",
    opacity: Number(formData.get("opacity")) || 0.85,
    text_content: String(formData.get("text_content") ?? "Sif's Gold"),
    font_family: String(formData.get("font_family") ?? "Montserrat"),
    font_color: String(formData.get("font_color") ?? "#FFFFFF"),
    background_blur: formData.get("background_blur") === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("watermark_templates").update(row).eq("id", id).eq("user_id", userId);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("watermark_templates").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePhotoStudio();
  return { ok: true as const };
}

export async function setDefaultWatermark(templateId: string) {
  const { supabase, userId } = await requirePro();
  await supabase
    .from("watermark_templates")
    .update({ default_template: false })
    .eq("user_id", userId);
  const { error } = await supabase
    .from("watermark_templates")
    .update({ default_template: true })
    .eq("id", templateId)
    .eq("user_id", userId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePhotoStudio();
  return { ok: true as const };
}

export async function deleteWatermarkTemplate(templateId: string) {
  const { supabase, userId } = await requirePro();
  const { error } = await supabase
    .from("watermark_templates")
    .delete()
    .eq("id", templateId)
    .eq("user_id", userId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePhotoStudio();
  return { ok: true as const };
}

export async function requestPhotoConsent(appointmentId: string) {
  const { supabase, userId } = await requirePro();
  const token = randomBytes(24).toString("hex");

  const { data: appt, error: fetchErr } = await supabase
    .from("appointments")
    .select("id, pro_id, status")
    .eq("id", appointmentId)
    .eq("pro_id", userId)
    .single();

  if (fetchErr || !appt) return { ok: false as const, error: "Appointment not found" };
  if (appt.status !== "completed") {
    return { ok: false as const, error: "Photo consent can be requested after the appointment is completed." };
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      photo_consent_requested_at: new Date().toISOString(),
      photo_consent_token: token,
    })
    .eq("id", appointmentId);

  if (error) return { ok: false as const, error: error.message };

  const consentUrl = `/appointments/${appointmentId}/photo-consent?token=${token}`;
  revalidatePhotoStudio();
  return { ok: true as const, consentUrl };
}

export async function grantPhotoConsent(appointmentId: string, token: string) {
  const supabase = await createClientFromAction();
  if (!supabase) return { ok: false as const, error: "Not configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Sign in to grant consent." };

  const { data: appt, error } = await supabase
    .from("appointments")
    .select("id, client_id, photo_consent_token")
    .eq("id", appointmentId)
    .eq("client_id", user.id)
    .single();

  if (error || !appt) return { ok: false as const, error: "Appointment not found." };
  if (appt.photo_consent_token !== token) {
    return { ok: false as const, error: "Invalid or expired consent link." };
  }

  const { error: updateErr } = await supabase
    .from("appointments")
    .update({
      client_consent_for_photos: true,
      photo_consent_granted_at: new Date().toISOString(),
      photo_consent_token: null,
    })
    .eq("id", appointmentId)
    .eq("client_id", user.id);

  if (updateErr) return { ok: false as const, error: updateErr.message };
  return { ok: true as const };
}

async function createClientFromAction() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function saveAssetToPortfolio(
  assetId: string,
  payload: { altText: string; category: string; caption?: string },
) {
  const { supabase, userId } = await requirePro();

  const { data: asset, error: assetErr } = await supabase
    .from("photo_studio_assets")
    .select("*")
    .eq("id", assetId)
    .eq("user_id", userId)
    .single();

  if (assetErr || !asset) return { ok: false as const, error: "Asset not found" };

  if (asset.linked_appointment_id && !asset.linked_client_consent) {
    const { data: appt } = await supabase
      .from("appointments")
      .select("client_consent_for_photos")
      .eq("id", asset.linked_appointment_id)
      .single();
    if (!appt?.client_consent_for_photos) {
      return {
        ok: false as const,
        error: "Client consent is required before adding this photo to your public portfolio.",
      };
    }
  }

  const imageUrl = asset.edited_image_url || asset.original_image_url;
  const insert: Record<string, unknown> = {
    pro_id: userId,
    category: payload.category,
    image_url: imageUrl,
    thumb_url: imageUrl,
    alt_text: payload.altText,
    caption: payload.caption ?? null,
    display_order: 0,
  };
  if (asset.type === "before_after" && asset.before_image_url) {
    insert.before_image_url = asset.before_image_url;
  }

  const { data: portfolio, error: portErr } = await supabase
    .from("portfolio_items")
    .insert(insert)
    .select("id")
    .single();

  if (portErr || !portfolio) return { ok: false as const, error: portErr?.message ?? "Portfolio save failed" };

  await supabase
    .from("photo_studio_assets")
    .update({
      linked_portfolio_item_id: portfolio.id,
      linked_client_consent: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", assetId);

  revalidatePhotoStudio();
  revalidatePath("/dashboard/portfolio");
  return { ok: true as const, portfolioItemId: portfolio.id as string };
}

export async function redirectToNewEditor() {
  redirect("/dashboard/photo-studio/edit/new");
}
