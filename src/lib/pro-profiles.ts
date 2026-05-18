import "server-only";

import { isReservedUsername } from "@/lib/reserved-usernames";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getPublicBookableServices } from "@/lib/services/data";
import type { Credential, PortfolioItem, ProProfile, Testimonial } from "@/types/pro-profile";
import type { ServiceWithAddons } from "@/types/services";

export type PublicProProfileBundle = {
  profile: ProProfile;
  portfolio: PortfolioItem[];
  services: ServiceWithAddons[];
  credentials: Credential[];
  testimonials: Testimonial[];
};

function normalizeUsernameParam(username: string): string {
  return username.trim().toLowerCase();
}

export async function getVisibleProUsernames(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pro_profiles")
    .select("username")
    .eq("visible_in_search", true);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.username as string);
}

export async function getPublicProProfileByUsername(
  username: string,
): Promise<PublicProProfileBundle | null> {
  const normalized = normalizeUsernameParam(username);
  if (isReservedUsername(normalized)) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  if (!supabase) return null;

  const { data: profile, error: profileError } = await supabase
    .from("pro_profiles")
    .select("*")
    .eq("username", normalized)
    .eq("visible_in_search", true)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const proId = profile.id as string;

  const [portfolioRes, credentialsRes, testimonialsRes] = await Promise.all([
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("pro_id", proId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("credentials")
      .select("id, pro_id, type, name, issuing_authority, issue_date, expiry_date, credential_number, verification_url, public")
      .eq("pro_id", proId)
      .eq("public", true),
    supabase
      .from("testimonials")
      .select("id, pro_id, client_name, rating, text, pro_reply, service_id, created_at, featured")
      .eq("pro_id", proId)
      .eq("approved_by_pro", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const services = await getPublicBookableServices(proId);

  return {
    profile: profile as ProProfile,
    portfolio: (portfolioRes.data ?? []) as PortfolioItem[],
    services,
    credentials: (credentialsRes.data ?? []) as Credential[],
    testimonials: (testimonialsRes.data ?? []) as Testimonial[],
  };
}

export async function getOwnProProfile(userId: string): Promise<ProProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.from("pro_profiles").select("*").eq("id", userId).maybeSingle();
  return (data as ProProfile) ?? null;
}

export function formatLocation(profile: Pick<ProProfile, "location_city" | "location_state" | "location_country">): string | null {
  const parts = [profile.location_city, profile.location_state].filter(Boolean);
  if (parts.length === 0) return null;
  return parts.join(", ");
}

export function averageRating(testimonials: Testimonial[]): number | null {
  if (testimonials.length === 0) return null;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

export function bookStatusLabel(status: ProProfile["book_status"]): string {
  switch (status) {
    case "fully_open":
      return "Accepting bookings";
    case "request_only":
      return "Request only";
    case "closed":
      return "Bookings closed";
    case "exclusive":
      return "Exclusive clients";
    default:
      return "Booking status";
  }
}
