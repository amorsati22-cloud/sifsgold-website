export type PriceType = "fixed" | "starting_at" | "custom_quote";

export type ServiceCategoryRow = {
  id: string;
  label: string;
  parent_category: string | null;
  icon: string | null;
  display_order: number | null;
};

export type ServiceAddon = {
  id: string;
  service_id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price_amount: number;
  display_order: number | null;
};

export type Service = {
  id: string;
  pro_id: string;
  name: string;
  category: string | null;
  description: string | null;
  duration_minutes: number;
  price_amount: number;
  price_type: PriceType;
  price_high: number | null;
  requires_consultation: boolean;
  consultation_required_for_first_visit: boolean;
  max_per_day: number | null;
  prerequisites: string[] | null;
  aftercare_instructions: string | null;
  cancellation_policy: string | null;
  deposit_required: boolean;
  deposit_amount: number | null;
  visible: boolean;
  bookable_online: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

export type ServiceWithAddons = Service & {
  addons: ServiceAddon[];
};

/** @deprecated Use Service — kept for gradual migration */
export type ProService = Service;
