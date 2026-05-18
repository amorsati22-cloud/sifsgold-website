export type SalonStaffRole = "owner" | "manager" | "pro" | "apprentice";
export type SalonStaffStatus = "active" | "on_leave" | "terminated" | "invited";
export type BoothRentFrequency = "weekly" | "monthly";

export type Salon = {
  id: string;
  owner_id: string;
  name: string;
  legal_name: string | null;
  encrypted_ein: string | null;
  ein_iv: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  phone: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  timezone: string;
  subscription_tier: string | null;
  slug: string | null;
  cancellation_policy: string | null;
  no_show_policy: string | null;
  deposit_policy: string | null;
  default_deposit_percent: number;
  is_public: boolean;
};

export type SalonStaff = {
  id: string;
  salon_id: string;
  pro_id: string;
  role: SalonStaffRole;
  commission_split: number | null;
  booth_rent_amount: number | null;
  booth_rent_frequency: BoothRentFrequency | null;
  start_date: string | null;
  end_date: string | null;
  status: SalonStaffStatus;
  can_set_own_prices: boolean;
  can_take_own_bookings: boolean;
  calendar_color: string | null;
  stripe_connect_account_id: string | null;
  display_name?: string;
  username?: string;
  avatar_url?: string | null;
  week_revenue?: number;
};

export type SalonInventoryItem = {
  id: string;
  salon_id: string;
  product_name: string;
  brand: string | null;
  sku: string | null;
  unit: string;
  quantity_on_hand: number;
  reorder_point: number;
  cost_per_unit: number | null;
  retail_price: number | null;
  supplier: string | null;
};

export type SalonService = {
  id: string;
  salon_id: string;
  name: string;
  category: string | null;
  description: string | null;
  duration_minutes: number;
  price_amount: number;
  price_type: string;
  active: boolean;
};

export type SalonAppointment = {
  id: string;
  pro_id: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  price_total: number;
  service_name: string | null;
  client_name: string;
  staff_name: string;
  staff_color: string;
};

export type SalonHomeOverview = {
  salon: Salon;
  teamWorking: SalonStaff[];
  teamOff: SalonStaff[];
  revenueToday: number;
  openAppointments: SalonAppointment[];
  lowStock: SalonInventoryItem[];
};

export type StaffPayoutLine = {
  staff_id: string;
  pro_id: string;
  display_name: string;
  gross_revenue: number;
  commission_split: number | null;
  booth_rent_deduction: number;
  other_deductions: number;
  net_owed: number;
  stripe_connect_account_id: string | null;
};

export type SalonPayoutRecord = {
  id: string;
  staff_id: string;
  period_start: string;
  period_end: string;
  gross_revenue: number;
  net_owed: number;
  status: string;
  stripe_transfer_id: string | null;
  created_at: string;
  display_name?: string;
};
