import type { ServiceCategoryRow } from "@/types/services";

/** Seeded in DB; fallback when Supabase unavailable (pickers still work in dev). */
export const SERVICE_CATEGORIES_FALLBACK: ServiceCategoryRow[] = [
  { id: "consultation", label: "Consultation", parent_category: null, icon: "MessageCircle", display_order: 5 },
  { id: "hair", label: "Hair", parent_category: null, icon: "Scissors", display_order: 10 },
  { id: "hair_color", label: "Hair Color", parent_category: "hair", icon: "Palette", display_order: 11 },
  { id: "hair_cut", label: "Hair Cut", parent_category: "hair", icon: "Scissors", display_order: 12 },
  { id: "hair_styling", label: "Hair Styling", parent_category: "hair", icon: "Sparkles", display_order: 13 },
  { id: "hair_extensions", label: "Extensions", parent_category: "hair", icon: "Layers", display_order: 14 },
  { id: "hair_treatments", label: "Hair Treatments", parent_category: "hair", icon: "Droplets", display_order: 15 },
  { id: "barbering", label: "Barbering", parent_category: null, icon: "User", display_order: 20 },
  { id: "makeup", label: "Makeup", parent_category: null, icon: "Brush", display_order: 30 },
  { id: "makeup_bridal", label: "Bridal Makeup", parent_category: "makeup", icon: "Heart", display_order: 31 },
  { id: "nails", label: "Nails", parent_category: null, icon: "Hand", display_order: 40 },
  { id: "lashes", label: "Lashes", parent_category: null, icon: "Eye", display_order: 50 },
  { id: "brows", label: "Brows", parent_category: null, icon: "ScanEye", display_order: 51 },
  { id: "skincare", label: "Skincare", parent_category: null, icon: "Sun", display_order: 60 },
  { id: "facials", label: "Facials", parent_category: "skincare", icon: "Sparkle", display_order: 61 },
  { id: "waxing", label: "Waxing", parent_category: null, icon: "Flame", display_order: 70 },
  { id: "massage", label: "Massage", parent_category: null, icon: "HeartPulse", display_order: 80 },
  { id: "fitness", label: "Fitness", parent_category: null, icon: "Dumbbell", display_order: 90 },
  { id: "tattoo", label: "Tattoo", parent_category: null, icon: "PenTool", display_order: 100 },
  { id: "piercing", label: "Piercing", parent_category: null, icon: "Gem", display_order: 110 },
  { id: "med_spa", label: "Med Spa", parent_category: null, icon: "Syringe", display_order: 120 },
  { id: "other", label: "Other", parent_category: null, icon: "MoreHorizontal", display_order: 999 },
];

export type CategoryGroup = {
  parent: ServiceCategoryRow;
  children: ServiceCategoryRow[];
};

export function groupCategoriesByParent(categories: ServiceCategoryRow[]): CategoryGroup[] {
  const sorted = [...categories].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const parents = sorted.filter((c) => !c.parent_category);
  const children = sorted.filter((c) => c.parent_category);

  return parents.map((parent) => ({
    parent,
    children: children.filter((c) => c.parent_category === parent.id),
  }));
}

export function getCategoryLabel(categories: ServiceCategoryRow[], id: string | null): string {
  if (!id) return "Other";
  return categories.find((c) => c.id === id)?.label ?? id.replace(/_/g, " ");
}
