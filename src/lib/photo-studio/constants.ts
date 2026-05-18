import type { PhotoAssetType } from "@/types/photo-studio";

export const PHOTO_STUDIO_BUCKET = "photo-studio";

export const PHOTO_STUDIO_NAV = [
  { href: "/dashboard/photo-studio", label: "Studio home", exact: true },
  { href: "/dashboard/photo-studio/before-after", label: "Before / After" },
  { href: "/dashboard/photo-studio/social", label: "Social posts" },
  { href: "/dashboard/photo-studio/batch", label: "Batch export" },
  { href: "/dashboard/photo-studio/watermarks", label: "Watermarks" },
] as const;

export const NEW_PROJECT_ACTIONS: {
  href: string;
  label: string;
  description: string;
  type: PhotoAssetType;
}[] = [
  {
    href: "/dashboard/photo-studio/before-after",
    label: "Before / After slider",
    description: "Compare transformation shots with a draggable slider.",
    type: "before_after",
  },
  {
    href: "/dashboard/photo-studio/edit/new",
    label: "Single photo edit",
    description: "Crop, adjust, remove background, and watermark.",
    type: "single",
  },
  {
    href: "/dashboard/photo-studio/social",
    label: "Social media post",
    description: "Platform-ready dimensions and text overlays.",
    type: "social_post",
  },
  {
    href: "/dashboard/photo-studio/batch",
    label: "Batch upload",
    description: "Apply watermarks and crops to many files at once.",
    type: "gallery",
  },
];

export const SOCIAL_TEMPLATES = [
  { id: "instagram-square", label: "Instagram square", width: 1080, height: 1080, aspect: 1 },
  { id: "instagram-story", label: "Instagram Story", width: 1080, height: 1920, aspect: 9 / 16 },
  { id: "tiktok", label: "TikTok", width: 1080, height: 1920, aspect: 9 / 16 },
  { id: "pinterest", label: "Pinterest", width: 1000, height: 1500, aspect: 2 / 3 },
  { id: "youtube-thumb", label: "YouTube thumbnail", width: 1280, height: 720, aspect: 16 / 9 },
] as const;

export const CROP_PRESETS = [
  { id: "instagram", label: "1:1 Instagram", aspect: 1 },
  { id: "story", label: "9:16 Stories", aspect: 9 / 16 },
  { id: "portrait", label: "4:5 Portrait", aspect: 4 / 5 },
  { id: "free", label: "Free crop", aspect: undefined },
] as const;

export const BRAND_PALETTE = [
  { name: "Gold", hex: "#D4A843" },
  { name: "Gold body", hex: "#C49434" },
  { name: "Navy", hex: "#04101E" },
  { name: "Teal", hex: "#00C9B1" },
  { name: "Cream", hex: "#F5EFE0" },
  { name: "White", hex: "#FFFFFF" },
] as const;

export const FONT_OPTIONS = [
  { id: "playfair", label: "Playfair Display", css: "var(--font-playfair), serif" },
  { id: "montserrat", label: "Montserrat", css: "var(--font-montserrat), sans-serif" },
  { id: "space-mono", label: "Space Mono", css: "var(--font-space-mono), monospace" },
] as const;

export const CONSENT_COPY =
  "Client consent is required before photos can appear on your public portfolio. Request permission after an appointment is completed.";
