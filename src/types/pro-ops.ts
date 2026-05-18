import type { AppointmentStatus } from "@/types/booking";

export type ProEarningsSnapshot = {
  id: string;
  pro_id: string;
  snapshot_date: string;
  gross_revenue: number;
  platform_fees: number;
  net_revenue: number;
  appointment_count: number;
  avg_appointment_value: number;
  top_service_id: string | null;
  new_clients: number;
  repeat_clients: number;
};

export type ProClientRow = {
  id: string;
  client_id: string | null;
  guest_key: string | null;
  display_name: string;
  email: string | null;
  phone: string | null;
  last_visit: string | null;
  next_visit: string | null;
  appointment_count: number;
  total_spent: number;
  favorite: boolean;
};

export type ProClientNotes = {
  id: string;
  pro_id: string;
  client_id: string | null;
  guest_key: string | null;
  formula_notes: string | null;
  allergies: string | null;
  preferences: string | null;
  birthday: string | null;
  last_visit: string | null;
  next_visit: string | null;
  private_notes: string | null;
  favorite: boolean;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
};

export type ProBusinessSettings = {
  id: string;
  business_name: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  accepts_tips: boolean;
  default_tip_percentages: number[];
  requires_cancellation_policy_acceptance: boolean;
  auto_confirm_bookings: boolean;
  new_client_intake_required: boolean;
  intake_form_template_id: string | null;
  default_deposit_percent: number;
  cancellation_policy: string;
};

export type ProIntakeTemplate = {
  id: string;
  pro_id: string;
  name: string;
  description: string | null;
  fields: { id: string; label: string; type: string; required?: boolean }[];
  service_category: string | null;
  is_default: boolean;
};

export type ProTodayKpis = {
  appointmentsToday: number;
  expectedRevenueToday: number;
  pendingRequests: number;
  unreadMessages: number;
};

export type ProAppointmentWithClient = {
  id: string;
  scheduled_start: string;
  scheduled_end: string;
  status: AppointmentStatus;
  price_total: number;
  service_name: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_id: string | null;
};

export type ProInsights = {
  topServices: { name: string; count: number; revenue: number }[];
  inactiveClients: { name: string; email: string | null; last_visit: string }[];
  busiestDay: string;
  avgTicketTrend: { month: string; avg: number }[];
};
