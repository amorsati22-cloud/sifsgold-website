import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export const FOUNDING_MEMBER_CAP = 100;

export type AdminOverviewData = {
  waitlistTotal: number;
  waitlistLast7: number;
  waitlistPrev7: number;
  foundingCount: number;
  foundingCap: number;
  pendingAdvocates: number;
  openTickets: number;
  signupsByDay: { date: string; count: number }[];
  recentAudit: {
    id: string;
    created_at: string;
    admin_email: string;
    action: string;
    metadata: Record<string, unknown> | null;
  }[];
};

export async function fetchAdminOverview(admin: SupabaseClient): Promise<AdminOverviewData> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const iso7 = sevenDaysAgo.toISOString();
  const iso14 = fourteenDaysAgo.toISOString();
  const iso30 = thirtyDaysAgo.toISOString();

  const [
    waitlistAll,
    waitlistLast7,
    waitlistPrev7,
    founding,
    advocates,
    tickets,
    waitlist30,
    audit,
  ] = await Promise.all([
    admin.from("waitlist").select("id", { count: "exact", head: true }),
    admin.from("waitlist").select("id", { count: "exact", head: true }).gte("created_at", iso7),
    admin
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .gte("created_at", iso14)
      .lt("created_at", iso7),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("founding_member", true),
    admin
      .from("advocate_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    admin.from("waitlist").select("created_at").gte("created_at", iso30),
    admin
      .from("admin_audit_log")
      .select("id, created_at, admin_email, action, metadata")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const signupsByDay = bucketSignupsByDay((waitlist30.data ?? []) as { created_at: string }[]);

  return {
    waitlistTotal: waitlistAll.count ?? 0,
    waitlistLast7: waitlistLast7.count ?? 0,
    waitlistPrev7: waitlistPrev7.count ?? 0,
    foundingCount: founding.count ?? 0,
    foundingCap: FOUNDING_MEMBER_CAP,
    pendingAdvocates: advocates.count ?? 0,
    openTickets: tickets.count ?? 0,
    signupsByDay,
    recentAudit: (audit.data ?? []).map((row) => ({
      id: row.id as string,
      created_at: row.created_at as string,
      admin_email: row.admin_email as string,
      action: row.action as string,
      metadata: (row.metadata as Record<string, unknown>) ?? null,
    })),
  };
}

function bucketSignupsByDay(rows: { created_at: string }[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  const today = new Date();
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([date, count]) => ({ date, count }));
}
