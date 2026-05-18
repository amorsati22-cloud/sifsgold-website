import type { Service } from "@/types/services";

export type ServiceTemplate = Omit<
  Partial<Service>,
  "id" | "pro_id" | "created_at" | "updated_at"
> & {
  name: string;
  category: string;
  duration_minutes: number;
  price_amount: number;
};

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    name: "Balayage",
    category: "hair_color",
    description: "Hand-painted highlights for a natural, sun-kissed finish.",
    duration_minutes: 180,
    price_amount: 220,
    price_type: "starting_at",
    prerequisites: ["patch_test_48h_before", "arrive_with_clean_hair"],
    cancellation_policy: "24h_50_refund",
    deposit_required: true,
    deposit_amount: 75,
  },
  {
    name: "Men's Cut + Beard Trim",
    category: "barbering",
    description: "Precision cut with hot towel and line-up.",
    duration_minutes: 45,
    price_amount: 45,
    price_type: "fixed",
    cancellation_policy: "24h_full_refund",
  },
  {
    name: "Gel Manicure",
    category: "nails_manicure",
    description: "Cuticle care, shaping, and long-wear gel polish.",
    duration_minutes: 60,
    price_amount: 55,
    price_type: "fixed",
    cancellation_policy: "24h_full_refund",
  },
  {
    name: "Classic Lash Full Set",
    category: "lashes",
    description: "Individual extensions for natural volume.",
    duration_minutes: 120,
    price_amount: 165,
    price_type: "fixed",
    prerequisites: ["arrive_makeup_free"],
    cancellation_policy: "48h_full_refund",
    deposit_required: true,
    deposit_amount: 50,
  },
  {
    name: "Bridal Makeup Trial",
    category: "makeup_bridal",
    description: "Trial run with photos and timeline planning for wedding day.",
    duration_minutes: 90,
    price_amount: 125,
    price_type: "fixed",
    requires_consultation: true,
    cancellation_policy: "non_refundable",
  },
];
