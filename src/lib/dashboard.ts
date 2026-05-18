import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import type { Credential, PortfolioItem, ProProfile } from "@/types/pro-profile";

export async function requireProDashboardUser() {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !PRO_USER_TYPES.includes(profile.user_type as (typeof PRO_USER_TYPES)[number])) {
    redirect("/for-pros");
  }

  return { supabase, user };
}

export async function getDashboardProProfile(userId: string): Promise<ProProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("pro_profiles").select("*").eq("id", userId).maybeSingle();
  return (data as ProProfile) ?? null;
}

export async function getDashboardPortfolio(userId: string): Promise<PortfolioItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("pro_id", userId)
    .order("display_order", { ascending: true });
  return (data as PortfolioItem[]) ?? [];
}

export async function getDashboardCredentials(userId: string): Promise<Credential[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("credentials").select("*").eq("pro_id", userId);
  return (data as Credential[]) ?? [];
}

export async function getDashboardReviews(userId: string) {
  const supabase = await createClient();
  if (!supabase) return { pending: [], approved: [] };

  const { data } = await supabase
    .from("testimonials")
    .select("id, client_name, rating, text, pro_reply, created_at, approved_by_pro, featured")
    .eq("pro_id", userId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  return {
    pending: rows.filter((r) => !r.approved_by_pro),
    approved: rows.filter((r) => r.approved_by_pro),
  };
}
