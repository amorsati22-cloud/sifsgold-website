import "server-only";

import { endOfDay, endOfWeek, format, startOfDay, startOfWeek } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  Salon,
  SalonAppointment,
  SalonHomeOverview,
  SalonInventoryItem,
  SalonPayoutRecord,
  SalonService,
  SalonStaff,
  StaffPayoutLine,
} from "@/types/salon";

const STAFF_COLORS = ["#D4A843", "#6B9BD1", "#C97B84", "#7BC9A6", "#B388FF", "#FFAB40"];

function staffColor(index: number, custom: string | null) {
  return custom ?? STAFF_COLORS[index % STAFF_COLORS.length];
}

export async function getSalonStaff(salonId: string): Promise<SalonStaff[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: staff } = await supabase
    .from("salon_staff")
    .select("*, pro_profiles(display_name, username, avatar_url)")
    .eq("salon_id", salonId)
    .order("role", { ascending: true });

  const proIds = (staff ?? []).map((s) => s.pro_id as string);
  const revenueMap = new Map<string, number>();

  if (proIds.length > 0) {
    const { data: appts } = await supabase
      .from("appointments")
      .select("pro_id, price_total, status")
      .in("pro_id", proIds)
      .gte("scheduled_start", weekStart.toISOString())
      .lte("scheduled_start", weekEnd.toISOString())
      .in("status", ["confirmed", "completed", "in_progress"]);

    for (const a of appts ?? []) {
      const pid = a.pro_id as string;
      revenueMap.set(pid, (revenueMap.get(pid) ?? 0) + Number(a.price_total));
    }
  }

  return (staff ?? []).map((row, i) => {
    const pro = row.pro_profiles as {
      display_name: string;
      username: string;
      avatar_url: string | null;
    } | null;
    const proRaw = Array.isArray(row.pro_profiles) ? row.pro_profiles[0] : pro;
    return {
      id: row.id as string,
      salon_id: row.salon_id as string,
      pro_id: row.pro_id as string,
      role: row.role as SalonStaff["role"],
      commission_split: row.commission_split != null ? Number(row.commission_split) : null,
      booth_rent_amount: row.booth_rent_amount != null ? Number(row.booth_rent_amount) : null,
      booth_rent_frequency: row.booth_rent_frequency as SalonStaff["booth_rent_frequency"],
      start_date: row.start_date as string | null,
      end_date: row.end_date as string | null,
      status: row.status as SalonStaff["status"],
      can_set_own_prices: Boolean(row.can_set_own_prices),
      can_take_own_bookings: Boolean(row.can_take_own_bookings),
      calendar_color: row.calendar_color as string | null,
      stripe_connect_account_id: row.stripe_connect_account_id as string | null,
      display_name: proRaw?.display_name ?? "Team member",
      username: proRaw?.username,
      avatar_url: proRaw?.avatar_url ?? null,
      week_revenue: revenueMap.get(row.pro_id as string) ?? 0,
    };
  }).map((s, i) => ({ ...s, calendar_color: staffColor(i, s.calendar_color) }));
}

export async function getSalonHomeOverview(salon: Salon): Promise<Omit<SalonHomeOverview, "salon">> {
  const supabase = await createClient();
  if (!supabase) {
    return { teamWorking: [], teamOff: [], revenueToday: 0, openAppointments: [], lowStock: [] };
  }

  const staff = await getSalonStaff(salon.id);
  const activeStaff = staff.filter((s) => s.status === "active");
  const teamWorking = activeStaff.filter((s) => s.can_take_own_bookings);
  const teamOff = activeStaff.filter((s) => !s.can_take_own_bookings || s.status === "on_leave");

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const proIds = activeStaff.map((s) => s.pro_id);

  let revenueToday = 0;
  let openAppointments: SalonAppointment[] = [];

  if (proIds.length > 0) {
    const { data: appts } = await supabase
      .from("appointments")
      .select("*, services(name)")
      .in("pro_id", proIds)
      .gte("scheduled_start", todayStart.toISOString())
      .lte("scheduled_start", todayEnd.toISOString())
      .order("scheduled_start", { ascending: true });

    const staffByPro = new Map(activeStaff.map((s) => [s.pro_id, s]));

    openAppointments = (appts ?? [])
      .filter((a) => !["cancelled_by_client", "cancelled_by_pro"].includes(a.status as string))
      .map((a) => {
        const member = staffByPro.get(a.pro_id as string);
        return {
          id: a.id as string,
          pro_id: a.pro_id as string,
          scheduled_start: a.scheduled_start as string,
          scheduled_end: a.scheduled_end as string,
          status: a.status as string,
          price_total: Number(a.price_total),
          service_name: (a.services as { name: string } | null)?.name ?? null,
          client_name: (a.guest_name as string) ?? "Guest",
          staff_name: member?.display_name ?? "Staff",
          staff_color: member?.calendar_color ?? STAFF_COLORS[0],
        };
      });

    revenueToday = openAppointments
      .filter((a) => ["confirmed", "completed", "in_progress"].includes(a.status))
      .reduce((sum, a) => sum + a.price_total, 0);
  }

  const { data: inventory } = await supabase
    .from("salon_inventory")
    .select("*")
    .eq("salon_id", salon.id);

  const lowStock = (inventory ?? [])
    .filter((item) => Number(item.quantity_on_hand) <= Number(item.reorder_point))
    .map((item) => ({
      id: item.id as string,
      salon_id: item.salon_id as string,
      product_name: item.product_name as string,
      brand: item.brand as string | null,
      sku: item.sku as string | null,
      unit: item.unit as string,
      quantity_on_hand: Number(item.quantity_on_hand),
      reorder_point: Number(item.reorder_point),
      cost_per_unit: item.cost_per_unit != null ? Number(item.cost_per_unit) : null,
      retail_price: item.retail_price != null ? Number(item.retail_price) : null,
      supplier: item.supplier as string | null,
    }));

  return { teamWorking, teamOff, revenueToday, openAppointments, lowStock };
}

export async function getSalonAppointments(
  salonId: string,
  from: Date,
  to: Date,
): Promise<SalonAppointment[]> {
  const staff = await getSalonStaff(salonId);
  const proIds = staff.filter((s) => s.status === "active").map((s) => s.pro_id);
  if (proIds.length === 0) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("appointments")
    .select("*, services(name)")
    .in("pro_id", proIds)
    .gte("scheduled_start", from.toISOString())
    .lte("scheduled_start", to.toISOString())
    .order("scheduled_start", { ascending: true });

  const staffByPro = new Map(staff.map((s) => [s.pro_id, s]));

  return (data ?? []).map((a) => {
    const member = staffByPro.get(a.pro_id as string);
    return {
      id: a.id as string,
      pro_id: a.pro_id as string,
      scheduled_start: a.scheduled_start as string,
      scheduled_end: a.scheduled_end as string,
      status: a.status as string,
      price_total: Number(a.price_total),
      service_name: (a.services as { name: string } | null)?.name ?? null,
      client_name: (a.guest_name as string) ?? "Guest",
      staff_name: member?.display_name ?? "Staff",
      staff_color: member?.calendar_color ?? STAFF_COLORS[0],
    };
  });
}

export async function getSalonInventory(salonId: string): Promise<SalonInventoryItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("salon_inventory")
    .select("*")
    .eq("salon_id", salonId)
    .order("product_name", { ascending: true });
  return (data ?? []).map((row) => ({
    id: row.id as string,
    salon_id: row.salon_id as string,
    product_name: row.product_name as string,
    brand: row.brand as string | null,
    sku: row.sku as string | null,
    unit: row.unit as string,
    quantity_on_hand: Number(row.quantity_on_hand),
    reorder_point: Number(row.reorder_point),
    cost_per_unit: row.cost_per_unit != null ? Number(row.cost_per_unit) : null,
    retail_price: row.retail_price != null ? Number(row.retail_price) : null,
    supplier: row.supplier as string | null,
  }));
}

export async function getSalonServices(salonId: string): Promise<SalonService[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("salon_services")
    .select("*")
    .eq("salon_id", salonId)
    .order("display_order", { ascending: true });
  return (data ?? []).map((row) => ({
    id: row.id as string,
    salon_id: row.salon_id as string,
    name: row.name as string,
    category: row.category as string | null,
    description: row.description as string | null,
    duration_minutes: Number(row.duration_minutes),
    price_amount: Number(row.price_amount),
    price_type: row.price_type as string,
    active: Boolean(row.active),
  }));
}

export async function getStaffMember(salonId: string, proId: string): Promise<SalonStaff | null> {
  const staff = await getSalonStaff(salonId);
  return staff.find((s) => s.pro_id === proId) ?? null;
}

export async function getStaffAppointments(
  proId: string,
  from: Date,
  to: Date,
): Promise<SalonAppointment[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("appointments")
    .select("*, services(name)")
    .eq("pro_id", proId)
    .gte("scheduled_start", from.toISOString())
    .lte("scheduled_start", to.toISOString())
    .order("scheduled_start", { ascending: true });

  return (data ?? []).map((a) => ({
    id: a.id as string,
    pro_id: a.pro_id as string,
    scheduled_start: a.scheduled_start as string,
    scheduled_end: a.scheduled_end as string,
    status: a.status as string,
    price_total: Number(a.price_total),
    service_name: (a.services as { name: string } | null)?.name ?? null,
    client_name: (a.guest_name as string) ?? "Guest",
    staff_name: "",
    staff_color: STAFF_COLORS[0],
  }));
}

export async function calculateStaffPayouts(
  salonId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<StaffPayoutLine[]> {
  const staff = await getSalonStaff(salonId);
  const active = staff.filter((s) => s.status === "active" && s.role !== "owner");
  const proIds = active.map((s) => s.pro_id);
  if (proIds.length === 0) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data: appts } = await supabase
    .from("appointments")
    .select("pro_id, price_total, status")
    .in("pro_id", proIds)
    .gte("scheduled_start", periodStart.toISOString())
    .lte("scheduled_start", periodEnd.toISOString())
    .eq("status", "completed");

  const grossByPro = new Map<string, number>();
  for (const a of appts ?? []) {
    const pid = a.pro_id as string;
    grossByPro.set(pid, (grossByPro.get(pid) ?? 0) + Number(a.price_total));
  }

  return active.map((s) => {
    const gross = grossByPro.get(s.pro_id) ?? 0;
    const split = s.commission_split ?? 60;
    const commissionAmount = (gross * split) / 100;
    let boothRent = 0;
    if (s.booth_rent_amount && s.booth_rent_frequency === "weekly") {
      boothRent = Number(s.booth_rent_amount);
    } else if (s.booth_rent_amount && s.booth_rent_frequency === "monthly") {
      boothRent = Number(s.booth_rent_amount) / 4;
    }
    const net = Math.max(0, commissionAmount - boothRent);

    return {
      staff_id: s.id,
      pro_id: s.pro_id,
      display_name: s.display_name ?? "Staff",
      gross_revenue: Math.round(gross * 100) / 100,
      commission_split: split,
      booth_rent_deduction: Math.round(boothRent * 100) / 100,
      other_deductions: 0,
      net_owed: Math.round(net * 100) / 100,
      stripe_connect_account_id:
        s.stripe_connect_account_id ?? null,
    };
  });
}

export async function getSalonPayoutHistory(salonId: string): Promise<SalonPayoutRecord[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("salon_payouts")
    .select("*, salon_staff(pro_profiles(display_name))")
    .eq("salon_id", salonId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((row) => {
    const ss = row.salon_staff as { pro_profiles: { display_name: string } | { display_name: string }[] } | null;
    const proRaw = ss?.pro_profiles;
    const name = Array.isArray(proRaw) ? proRaw[0]?.display_name : proRaw?.display_name;
    return {
      id: row.id as string,
      staff_id: row.staff_id as string,
      period_start: row.period_start as string,
      period_end: row.period_end as string,
      gross_revenue: Number(row.gross_revenue),
      net_owed: Number(row.net_owed),
      status: row.status as string,
      stripe_transfer_id: row.stripe_transfer_id as string | null,
      created_at: row.created_at as string,
      display_name: name ?? "Staff",
    };
  });
}

export async function getPublicSalon(salonIdOrSlug: string): Promise<{
  salon: Salon;
  staff: SalonStaff[];
  services: SalonService[];
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const isUuid = /^[0-9a-f-]{36}$/i.test(salonIdOrSlug);
  let query = supabase.from("salons").select("*").eq("is_public", true);
  query = isUuid ? query.eq("id", salonIdOrSlug) : query.eq("slug", salonIdOrSlug);

  const { data: salon } = await query.maybeSingle();
  if (!salon) return null;

  const staff = await getSalonStaff(salon.id as string);
  const services = await getSalonServices(salon.id as string);

  return {
    salon: salon as Salon,
    staff: staff.filter((s) => s.status === "active"),
    services: services.filter((s) => s.active),
  };
}

export async function ensureOwnerStaffRow(salon: Salon, ownerId: string) {
  const admin = createAdminClient();
  const db = admin ?? (await createClient());
  if (!db) return;

  const { data: existing } = await db
    .from("salon_staff")
    .select("id")
    .eq("salon_id", salon.id)
    .eq("pro_id", ownerId)
    .maybeSingle();

  if (!existing) {
    await db.from("salon_staff").insert({
      salon_id: salon.id,
      pro_id: ownerId,
      role: "owner",
      status: "active",
      commission_split: 100,
    });
  }
}

export function formatSalonAddress(salon: Salon): string {
  const parts = [salon.address_line_1, salon.city, salon.state, salon.zip].filter(Boolean);
  return parts.join(", ");
}
