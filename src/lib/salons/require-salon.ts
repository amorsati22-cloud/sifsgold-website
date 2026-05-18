import "server-only";

import { redirect } from "next/navigation";
import { isSalonUserType } from "@/lib/auth-salon";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Salon } from "@/types/salon";

export async function requireSalonDashboardUser(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  user: { id: string; email?: string };
  salon: Salon;
}> {
  if (!isSupabaseConfigured()) redirect("/sign-in");

  const supabase = await createClient();
  if (!supabase) redirect("/sign-in");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard/salon/home");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.user_type || !isSalonUserType(profile.user_type)) {
    redirect("/for-salons");
  }

  let { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!salon) {
    const slug = `salon-${user.id.slice(0, 8)}`;
    const { data: created } = await supabase
      .from("salons")
      .insert({
        owner_id: user.id,
        name: "My Salon",
        slug,
        subscription_tier: "salon-standard",
      })
      .select("*")
      .single();
    salon = created;
  }

  if (!salon) redirect("/dashboard/salon/settings");

  return { supabase, user, salon: salon as Salon };
}

export async function getSalonForOwner(userId: string): Promise<Salon | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("salons").select("*").eq("owner_id", userId).maybeSingle();
  return (data as Salon) ?? null;
}
