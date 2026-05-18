export type AppointmentStatus =
  | "pending_confirmation"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled_by_client"
  | "cancelled_by_pro"
  | "no_show";

export type AvailabilityRule = {
  id: string;
  pro_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  active: boolean;
  effective_from: string | null;
  effective_until: string | null;
};

export type AvailabilityOverride = {
  id: string;
  pro_id: string;
  override_date: string;
  type: "unavailable" | "custom_hours" | "vacation" | "holiday";
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  recurring: boolean;
};

export type Appointment = {
  id: string;
  created_at: string;
  pro_id: string;
  client_id: string | null;
  service_id: string | null;
  addon_ids: string[] | null;
  scheduled_start: string;
  scheduled_end: string;
  timezone: string;
  status: AppointmentStatus;
  price_total: number;
  deposit_amount: number;
  deposit_paid: boolean;
  deposit_stripe_payment_intent_id: string | null;
  final_paid: boolean;
  final_stripe_payment_intent_id: string | null;
  client_notes: string | null;
  pro_notes: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  vision_attachments: string[] | null;
  created_via: string | null;
  reminder_sent: boolean;
  confirmation_sent: boolean;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  reserved_until: string | null;
  reservation_token: string | null;
};

export type TimeSlot = {
  start: string;
  end: string;
  timezone: string;
};

export type DayAvailability = {
  date: string;
  hasSlots: boolean;
};
