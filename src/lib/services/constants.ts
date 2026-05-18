export const PREREQUISITE_OPTIONS = [
  { id: "patch_test_24h_before", label: "Patch test 24 hours before" },
  { id: "patch_test_48h_before", label: "Patch test 48 hours before" },
  { id: "no_caffeine_day_of", label: "No caffeine day of appointment" },
  { id: "arrive_with_clean_hair", label: "Arrive with clean, dry hair" },
  { id: "arrive_makeup_free", label: "Arrive makeup-free" },
  { id: "avoid_retinol_48h", label: "Avoid retinol 48 hours before" },
  { id: "avoid_sun_24h", label: "Avoid sun exposure 24 hours before" },
  { id: "fill_intake_form", label: "Complete intake form before visit" },
  { id: "consultation_required", label: "Consultation required before booking" },
] as const;

export const CANCELLATION_POLICIES = [
  { id: "24h_full_refund", label: "24+ hours: full refund" },
  { id: "24h_50_refund", label: "24+ hours: 50% refund" },
  { id: "48h_full_refund", label: "48+ hours: full refund" },
  { id: "non_refundable", label: "Non-refundable" },
  { id: "deposit_forfeited", label: "Deposit forfeited if cancelled late" },
  { id: "custom", label: "Custom policy (describe in notes)" },
] as const;

export function prerequisiteLabel(id: string): string {
  return PREREQUISITE_OPTIONS.find((p) => p.id === id)?.label ?? id.replace(/_/g, " ");
}

export function cancellationPolicyLabel(id: string | null): string {
  if (!id) return "Contact the professional for cancellation terms.";
  return CANCELLATION_POLICIES.find((p) => p.id === id)?.label ?? id.replace(/_/g, " ");
}
