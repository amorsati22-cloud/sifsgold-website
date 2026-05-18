import type { AppointmentStatus } from "@/types/booking";

export type ClientFavorite = {
  id: string;
  pro_id: string;
  added_at: string;
  pro?: ProSummary;
};

export type ProSummary = {
  id: string;
  username: string;
  display_name: string;
  headline: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_state: string | null;
  specialties: string[] | null;
  book_status: string;
};

export type ClientAppointmentRow = {
  id: string;
  scheduled_start: string;
  scheduled_end: string;
  status: AppointmentStatus;
  price_total: number;
  deposit_paid: boolean;
  deposit_amount: number;
  final_paid: boolean;
  service_name: string | null;
  pro: ProSummary | null;
};

export type ClientVisionBoard = {
  id: string;
  created_at: string;
  title: string | null;
  image_urls: string[];
  notes: string | null;
  attached_to_appointment: string | null;
  privacy: string;
};

export type ClientPaymentRow = {
  id: string;
  type: "booking_deposit" | "shop_order";
  date: string;
  amount: number;
  status: string;
  label: string;
  receipt_url: string | null;
};

export type ClientSettings = {
  client_id: string;
  email_reminders: boolean;
  sms_reminders: boolean;
  marketing_email: boolean;
  profile_visible: boolean;
  vision_boards_visible_to_pros: boolean;
  location_city: string | null;
  location_state: string | null;
  location_lat: number | null;
  location_lng: number | null;
};
