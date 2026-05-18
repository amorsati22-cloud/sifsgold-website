import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { BeautyBodyService } from "@/types/affirmations";
import type { ProSummary } from "@/types/client-dashboard";

const PRO_SELECT =
  "id, username, display_name, headline, avatar_url, location_city, location_state, specialties, book_status";

/**
 * Find bookable pros matching a body-map service filter.
 * Joins visible services when Supabase is available; falls back to specialty match.
 */
export async function findProsForBodyService(
  service: BeautyBodyService,
  opts?: { city?: string; state?: string; limit?: number },
): Promise<ProSummary[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const limit = opts?.limit ?? 24;
  const filter = service.finding_pros_filter;
  const categories = filter.serviceCategories ?? [];
  const specialties = filter.specialties ?? [];
  const terms = filter.searchTerms ?? [service.service_name];

  const proIds = new Set<string>();

  if (categories.length > 0) {
    const { data: svcRows } = await supabase
      .from("services")
      .select("pro_id")
      .eq("visible", true)
      .eq("bookable_online", true)
      .in("category", categories)
      .limit(200);
    for (const row of svcRows ?? []) proIds.add(row.pro_id as string);
  }

  for (const term of terms) {
    const { data: named } = await supabase
      .from("services")
      .select("pro_id")
      .eq("visible", true)
      .ilike("name", `%${term}%`)
      .limit(100);
    for (const row of named ?? []) proIds.add(row.pro_id as string);
  }

  let query = supabase.from("pro_profiles").select(PRO_SELECT).eq("visible_in_search", true).limit(limit);

  if (opts?.city) query = query.ilike("location_city", `%${opts.city}%`);
  if (opts?.state) query = query.ilike("location_state", `%${opts.state}%`);

  if (proIds.size > 0) {
    query = query.in("id", [...proIds]);
  } else if (specialties.length > 0) {
    query = query.overlaps("specialties", specialties);
  }

  const { data } = await query;
  return (data ?? []) as ProSummary[];
}
