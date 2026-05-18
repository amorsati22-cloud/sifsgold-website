import "server-only";

import { addDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  ClientAppointmentRow,
  ClientPaymentRow,
  ClientSettings,
  ClientVisionBoard,
  ProSummary,
} from "@/types/client-dashboard";

const PRO_SUMMARY_SELECT =
  "id, username, display_name, headline, avatar_url, location_city, location_state, specialties, book_status";

function mapPro(row: Record<string, unknown> | null): ProSummary | null {
  if (!row) return null;
  return row as unknown as ProSummary;
}

export async function requireClientSession() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile };
}

export async function getClientAppointments(
  clientId: string,
  opts?: { upcomingOnly?: boolean; limit?: number; status?: string; email?: string },
): Promise<ClientAppointmentRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from("appointments")
    .select(`*, services(name), pro_profiles(${PRO_SUMMARY_SELECT})`)
    .order("scheduled_start", { ascending: opts?.upcomingOnly ?? false });

  if (opts?.email) {
    query = query.or(`client_id.eq.${clientId},guest_email.eq.${opts.email}`);
  } else {
    query = query.eq("client_id", clientId);
  }

  if (opts?.upcomingOnly) {
    query = query
      .gte("scheduled_start", new Date().toISOString())
      .in("status", ["pending_confirmation", "confirmed", "in_progress"]);
  }

  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data } = await query;
  return (data ?? []).map((row) => {
    const pro = row.pro_profiles as Record<string, unknown> | null;
    const service = row.services as { name: string } | null;
    return {
      id: row.id as string,
      scheduled_start: row.scheduled_start as string,
      scheduled_end: row.scheduled_end as string,
      status: row.status as ClientAppointmentRow["status"],
      price_total: Number(row.price_total),
      deposit_paid: Boolean(row.deposit_paid),
      deposit_amount: Number(row.deposit_amount),
      final_paid: Boolean(row.final_paid),
      service_name: service?.name ?? null,
      pro: mapPro(pro),
    };
  });
}

export async function getLastCompletedAppointment(clientId: string, email: string | undefined) {
  const supabase = await createClient();
  if (!supabase) return null;

  let query = supabase
    .from("appointments")
    .select(`*, services(id, name), pro_profiles(username, display_name)`)
    .in("status", ["completed", "confirmed"])
    .order("scheduled_start", { ascending: false })
    .limit(1);

  if (email) {
    query = query.or(`client_id.eq.${clientId},guest_email.eq.${email}`);
  } else {
    query = query.eq("client_id", clientId);
  }

  const { data } = await query;
  return data?.[0] ?? null;
}

export async function getClientFavorites(clientId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("client_favorites")
    .select(`id, pro_id, added_at, pro_profiles(${PRO_SUMMARY_SELECT})`)
    .eq("client_id", clientId)
    .order("added_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    pro_id: row.pro_id as string,
    added_at: row.added_at as string,
    pro: mapPro(row.pro_profiles as Record<string, unknown>),
  }));
}

export async function getRecentlyViewedPros(clientId: string, limit = 8) {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = addDays(new Date(), -30).toISOString();
  const { data } = await supabase
    .from("client_pro_views")
    .select(`viewed_at, pro_profiles(${PRO_SUMMARY_SELECT})`)
    .eq("client_id", clientId)
    .gte("viewed_at", since)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .map((row) => mapPro(row.pro_profiles as Record<string, unknown>))
    .filter(Boolean) as ProSummary[];
}

export async function discoverPros(opts?: {
  query?: string;
  specialty?: string;
  city?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return [];

  let q = supabase
    .from("pro_profiles")
    .select(PRO_SUMMARY_SELECT)
    .eq("visible_in_search", true)
    .limit(opts?.limit ?? 24);

  if (opts?.query) {
    q = q.or(
      `display_name.ilike.%${opts.query}%,username.ilike.%${opts.query}%,headline.ilike.%${opts.query}%`,
    );
  }
  if (opts?.city) {
    q = q.ilike("location_city", `%${opts.city}%`);
  }
  if (opts?.specialty) {
    q = q.contains("specialties", [opts.specialty]);
  }

  const { data } = await q;
  return (data ?? []) as ProSummary[];
}

export async function getClientVisionBoards(clientId: string): Promise<ClientVisionBoard[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("client_vision_history")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  return (data ?? []) as ClientVisionBoard[];
}

export async function getClientSettings(clientId: string): Promise<ClientSettings | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.from("client_settings").select("*").eq("client_id", clientId).maybeSingle();

  if (data) return data as ClientSettings;

  return {
    client_id: clientId,
    email_reminders: true,
    sms_reminders: false,
    marketing_email: false,
    profile_visible: false,
    vision_boards_visible_to_pros: true,
    location_city: null,
    location_state: null,
    location_lat: null,
    location_lng: null,
  };
}

export async function getClientPaymentHistory(clientId: string, email?: string): Promise<ClientPaymentRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const rows: ClientPaymentRow[] = [];

  let apptQuery = supabase
    .from("appointments")
    .select("id, scheduled_start, deposit_paid, deposit_amount, status, services(name)")
    .eq("deposit_paid", true)
    .order("scheduled_start", { ascending: false })
    .limit(50);

  if (email) {
    apptQuery = apptQuery.or(`client_id.eq.${clientId},guest_email.eq.${email}`);
  } else {
    apptQuery = apptQuery.eq("client_id", clientId);
  }

  const { data: appointments } = await apptQuery;
  for (const a of appointments ?? []) {
    const service = a.services as { name: string } | null;
    rows.push({
      id: a.id as string,
      type: "booking_deposit",
      date: a.scheduled_start as string,
      amount: Number(a.deposit_amount),
      status: a.status as string,
      label: service?.name ? `Deposit — ${service.name}` : "Booking deposit",
      receipt_url: `/api/client/receipts/${a.id}`,
    });
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, total, status, order_number")
    .eq("buyer_id", clientId)
    .in("status", ["paid", "processing", "shipped", "delivered"])
    .order("created_at", { ascending: false })
    .limit(50);

  for (const o of orders ?? []) {
    rows.push({
      id: o.id as string,
      type: "shop_order",
      date: o.created_at as string,
      amount: Number(o.total),
      status: o.status as string,
      label: `Order ${o.order_number}`,
      receipt_url: `/dashboard/orders/${o.id}`,
    });
  }

  return rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
