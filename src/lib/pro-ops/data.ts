import "server-only";

import {
  addDays,
  endOfDay,
  format,
  getDay,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  ProAppointmentWithClient,
  ProBusinessSettings,
  ProClientNotes,
  ProClientRow,
  ProInsights,
  ProIntakeTemplate,
  ProTodayKpis,
} from "@/types/pro-ops";
import type { Appointment } from "@/types/booking";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PLATFORM_FEE_RATE = 0.05;

function guestKey(email: string | null, phone: string | null, name: string): string {
  if (email) return `email:${email.toLowerCase()}`;
  if (phone) return `phone:${phone}`;
  return `name:${name.toLowerCase().trim()}`;
}

export async function getProAppointments(
  proId: string,
  from: Date,
  to: Date,
): Promise<ProAppointmentWithClient[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("appointments")
    .select("*, services(name)")
    .eq("pro_id", proId)
    .gte("scheduled_start", from.toISOString())
    .lte("scheduled_start", to.toISOString())
    .order("scheduled_start", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    scheduled_start: row.scheduled_start as string,
    scheduled_end: row.scheduled_end as string,
    status: row.status as ProAppointmentWithClient["status"],
    price_total: Number(row.price_total),
    service_name: (row.services as { name: string } | null)?.name ?? null,
    client_name: (row.guest_name as string) ?? "Guest",
    client_email: row.guest_email as string | null,
    client_phone: row.guest_phone as string | null,
    client_id: row.client_id as string | null,
  }));
}

export async function getProTodayKpis(proId: string, timezone = "America/Chicago"): Promise<ProTodayKpis> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const todayAppts = await getProAppointments(proId, todayStart, todayEnd);
  const activeToday = todayAppts.filter((a) =>
    ["confirmed", "in_progress", "pending_confirmation"].includes(a.status),
  );

  const expectedRevenue = activeToday.reduce((sum, a) => sum + a.price_total, 0);
  const pendingRequests = todayAppts.filter((a) => a.status === "pending_confirmation").length;

  return {
    appointmentsToday: activeToday.length,
    expectedRevenueToday: expectedRevenue,
    pendingRequests,
    unreadMessages: 0,
  };
}

export async function aggregateProClients(proId: string): Promise<ProClientRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: appointments } = await supabase
    .from("appointments")
    .select("client_id, guest_name, guest_email, guest_phone, scheduled_start, price_total, status")
    .eq("pro_id", proId)
    .in("status", ["confirmed", "completed", "in_progress", "no_show"]);

  const { data: notes } = await supabase.from("pro_client_notes").select("*").eq("pro_id", proId);

  const map = new Map<string, ProClientRow>();

  for (const a of appointments ?? []) {
    const name = (a.guest_name as string) ?? "Guest";
    const email = a.guest_email as string | null;
    const phone = a.guest_phone as string | null;
    const key = (a.client_id as string) ?? guestKey(email, phone, name);
    const visit = (a.scheduled_start as string).slice(0, 10);
    const spent = ["completed", "confirmed", "in_progress"].includes(a.status as string)
      ? Number(a.price_total)
      : 0;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        id: key,
        client_id: a.client_id as string | null,
        guest_key: a.client_id ? null : key,
        display_name: name,
        email,
        phone,
        last_visit: visit,
        next_visit: null,
        appointment_count: 1,
        total_spent: spent,
        favorite: false,
      });
    } else {
      existing.appointment_count += 1;
      existing.total_spent += spent;
      if (visit > (existing.last_visit ?? "")) existing.last_visit = visit;
    }
  }

  for (const n of notes ?? []) {
    const key = (n.client_id as string) ?? (n.guest_key as string);
    if (!key) continue;
    const row = map.get(key);
    if (row) {
      row.favorite = Boolean(n.favorite);
      row.next_visit = n.next_visit as string | null;
      if (n.guest_name) row.display_name = n.guest_name as string;
    } else {
      map.set(key, {
        id: n.id as string,
        client_id: n.client_id as string | null,
        guest_key: n.guest_key as string | null,
        display_name: (n.guest_name as string) ?? "Client",
        email: n.guest_email as string | null,
        phone: n.guest_phone as string | null,
        last_visit: n.last_visit as string | null,
        next_visit: n.next_visit as string | null,
        appointment_count: 0,
        total_spent: 0,
        favorite: Boolean(n.favorite),
      });
    }
  }

  const upcoming = await getProAppointments(proId, new Date(), addDays(new Date(), 90));
  for (const u of upcoming) {
    if (u.status !== "confirmed" && u.status !== "pending_confirmation") continue;
    const key = u.client_id ?? guestKey(u.client_email, u.client_phone, u.client_name);
    const row = map.get(key);
    if (row) {
      const d = u.scheduled_start.slice(0, 10);
      if (!row.next_visit || d < row.next_visit) row.next_visit = d;
    }
  }

  return Array.from(map.values()).sort((a, b) => (b.last_visit ?? "").localeCompare(a.last_visit ?? ""));
}

export async function getProClientDetail(proId: string, clientKey: string) {
  const clients = await aggregateProClients(proId);
  const client = clients.find((c) => c.id === clientKey || c.client_id === clientKey);
  if (!client) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  let notesQuery = supabase.from("pro_client_notes").select("*").eq("pro_id", proId);
  if (client.client_id) {
    notesQuery = notesQuery.eq("client_id", client.client_id);
  } else {
    notesQuery = notesQuery.eq("guest_key", client.guest_key ?? clientKey);
  }
  const { data: notes } = await notesQuery.maybeSingle();

  let apptQuery = supabase
    .from("appointments")
    .select("*, services(name)")
    .eq("pro_id", proId)
    .order("scheduled_start", { ascending: false });

  if (client.client_id) {
    apptQuery = apptQuery.eq("client_id", client.client_id);
  } else if (client.email) {
    apptQuery = apptQuery.eq("guest_email", client.email);
  }

  const { data: history } = await apptQuery;

  const completed = (history ?? []).filter((h) => h.status === "completed");
  const totalSpent = completed.reduce((s, h) => s + Number(h.price_total), 0);
  const avgTicket = completed.length ? totalSpent / completed.length : 0;

  return {
    client,
    notes: (notes as ProClientNotes | null) ?? null,
    appointments: history ?? [],
    totalSpent,
    avgTicket,
  };
}

export async function getProEarningsSummary(proId: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { thisMonth: 0, lastMonth: 0, byCategory: [], payouts: [] };
  }

  const monthStart = startOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = subDays(monthStart, 1);

  const { data: snapshots } = await supabase
    .from("pro_earnings_snapshots")
    .select("*")
    .eq("pro_id", proId)
    .gte("snapshot_date", format(lastMonthStart, "yyyy-MM-dd"))
    .order("snapshot_date", { ascending: true });

  if (snapshots && snapshots.length > 0) {
    const thisMonthRows = snapshots.filter((s) => s.snapshot_date >= format(monthStart, "yyyy-MM-dd"));
    const lastMonthRows = snapshots.filter(
      (s) =>
        s.snapshot_date >= format(lastMonthStart, "yyyy-MM-dd") &&
        s.snapshot_date <= format(lastMonthEnd, "yyyy-MM-dd"),
    );
    return {
      thisMonth: thisMonthRows.reduce((s, r) => s + Number(r.net_revenue), 0),
      lastMonth: lastMonthRows.reduce((s, r) => s + Number(r.net_revenue), 0),
      byCategory: [] as { name: string; value: number }[],
      payouts: [],
      snapshots,
    };
  }

  const { data: appts } = await supabase
    .from("appointments")
    .select("scheduled_start, price_total, status, services(name, category)")
    .eq("pro_id", proId)
    .in("status", ["completed", "confirmed"]);

  const thisMonthGross = (appts ?? [])
    .filter((a) => parseISO(a.scheduled_start as string) >= monthStart)
    .reduce((s, a) => s + Number(a.price_total), 0);

  const lastMonthGross = (appts ?? [])
    .filter((a) => {
      const d = parseISO(a.scheduled_start as string);
      return d >= lastMonthStart && d <= lastMonthEnd;
    })
    .reduce((s, a) => s + Number(a.price_total), 0);

  const categoryMap = new Map<string, number>();
  for (const a of appts ?? []) {
    const svc = a.services as { name: string; category: string | null } | null;
    const cat = svc?.category ?? "Other";
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + Number(a.price_total));
  }

  const fee = (g: number) => g * PLATFORM_FEE_RATE;

  return {
    thisMonth: thisMonthGross - fee(thisMonthGross),
    lastMonth: lastMonthGross - fee(lastMonthGross),
    byCategory: Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })),
    payouts: [],
    snapshots: [],
  };
}

export async function getProInsights(proId: string): Promise<ProInsights> {
  const supabase = await createClient();
  if (!supabase) {
    return { topServices: [], inactiveClients: [], busiestDay: "—", avgTicketTrend: [] };
  }

  const since90 = subDays(new Date(), 90).toISOString();
  const { data: appts } = await supabase
    .from("appointments")
    .select("scheduled_start, price_total, status, services(name)")
    .eq("pro_id", proId)
    .gte("scheduled_start", since90);

  const serviceMap = new Map<string, { count: number; revenue: number }>();
  const dayCounts = new Array(7).fill(0);

  for (const a of appts ?? []) {
    if (!["completed", "confirmed"].includes(a.status as string)) continue;
    const svc = (a.services as { name: string } | null)?.name ?? "Other";
    const cur = serviceMap.get(svc) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += Number(a.price_total);
    serviceMap.set(svc, cur);
    dayCounts[getDay(parseISO(a.scheduled_start as string))] += 1;
  }

  const topServices = Array.from(serviceMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const busiestIdx = dayCounts.indexOf(Math.max(...dayCounts));
  const clients = await aggregateProClients(proId);
  const inactiveClients = clients
    .filter((c) => c.last_visit && c.last_visit < format(subDays(new Date(), 90), "yyyy-MM-dd"))
    .slice(0, 8)
    .map((c) => ({ name: c.display_name, email: c.email, last_visit: c.last_visit! }));

  const trend: { month: string; avg: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const mStart = startOfMonth(subMonths(new Date(), i));
    const mEnd = startOfMonth(subMonths(new Date(), i - 1));
    const monthAppts = (appts ?? []).filter((a) => {
      const d = parseISO(a.scheduled_start as string);
      return d >= mStart && d < mEnd && a.status === "completed";
    });
    const total = monthAppts.reduce((s, a) => s + Number(a.price_total), 0);
    trend.push({
      month: format(mStart, "MMM"),
      avg: monthAppts.length ? total / monthAppts.length : 0,
    });
  }

  return {
    topServices,
    inactiveClients,
    busiestDay: DAY_NAMES[busiestIdx] ?? "—",
    avgTicketTrend: trend,
  };
}

export async function getProBusinessSettings(proId: string): Promise<ProBusinessSettings> {
  const supabase = await createClient();
  if (!supabase) return defaultBusinessSettings(proId);

  const { data } = await supabase.from("pro_business_settings").select("*").eq("id", proId).maybeSingle();
  if (data) return data as ProBusinessSettings;
  return defaultBusinessSettings(proId);
}

function defaultBusinessSettings(proId: string): ProBusinessSettings {
  return {
    id: proId,
    business_name: null,
    business_email: null,
    business_phone: null,
    business_address: null,
    accepts_tips: true,
    default_tip_percentages: [15, 20, 25],
    requires_cancellation_policy_acceptance: true,
    auto_confirm_bookings: false,
    new_client_intake_required: true,
    intake_form_template_id: null,
    default_deposit_percent: 0,
    cancellation_policy: "24h_full_refund",
  };
}

export async function getProIntakeTemplates(proId: string): Promise<ProIntakeTemplate[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("intake_form_templates")
    .select("*")
    .eq("pro_id", proId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    ...row,
    fields: (row.fields as ProIntakeTemplate["fields"]) ?? [],
  })) as ProIntakeTemplate[];
}

export async function getProCalendarAppointments(proId: string): Promise<Appointment[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("appointments")
    .select("*")
    .eq("pro_id", proId)
    .order("scheduled_start", { ascending: true })
    .limit(300);
  return (data as Appointment[]) ?? [];
}
