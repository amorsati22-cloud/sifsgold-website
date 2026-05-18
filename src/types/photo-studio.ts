export type PhotoAssetType = "before_after" | "single" | "social_post" | "gallery";

export type WatermarkPosition =
  | "bottom_right"
  | "bottom_left"
  | "top_right"
  | "top_left"
  | "center";

export interface ExportHistoryEntry {
  at: string;
  format: "png" | "jpg" | "webp" | "zip";
  preset?: "web" | "print" | "social";
  label?: string;
}

export interface CropData {
  unit?: "%" | "px";
  x: number;
  y: number;
  width: number;
  height: number;
  aspect?: number;
  preset?: string;
}

export interface EditState {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  watermarkTemplateId?: string;
}

export interface PhotoStudioAsset {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  type: PhotoAssetType;
  original_image_url: string;
  edited_image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  watermark_applied: boolean;
  background_removed: boolean;
  linked_portfolio_item_id: string | null;
  linked_appointment_id: string | null;
  linked_client_consent: boolean;
  crop_data: CropData | null;
  edit_state: EditState | null;
  export_history: ExportHistoryEntry[];
}

export interface WatermarkTemplate {
  id: string;
  user_id: string;
  name: string;
  position: WatermarkPosition;
  opacity: number;
  text_content: string;
  font_family: string;
  font_color: string;
  background_blur: boolean;
  default_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppointmentPhotoConsent {
  id: string;
  pro_id: string;
  client_id: string;
  status: string;
  client_consent_for_photos: boolean;
  photo_consent_requested_at: string | null;
  photo_consent_granted_at: string | null;
}
