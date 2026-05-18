import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SEED_BODY_SERVICES, SEED_BODY_ZONES } from "@/lib/body-map/seed-data";
import type { BeautyBodyService, BeautyBodyZone, BodyZoneId } from "@/types/affirmations";

export async function listBodyZones(): Promise<BeautyBodyZone[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("beauty_body_zones").select("*").order("id");
    if (data?.length) return data as BeautyBodyZone[];
  }
  return SEED_BODY_ZONES;
}

export async function getBodyZone(zoneId: string): Promise<BeautyBodyZone | null> {
  const zones = await listBodyZones();
  return zones.find((z) => z.id === zoneId) ?? null;
}

export async function listZoneServices(zoneId: string): Promise<BeautyBodyService[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("beauty_body_services")
      .select("*")
      .eq("zone_id", zoneId)
      .order("service_name");
    if (data?.length) return data as BeautyBodyService[];
  }
  return SEED_BODY_SERVICES.filter((s) => s.zone_id === zoneId);
}

export async function getBodyService(serviceId: string): Promise<BeautyBodyService | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("beauty_body_services").select("*").eq("id", serviceId).maybeSingle();
    if (data) return data as BeautyBodyService;
  }
  return SEED_BODY_SERVICES.find((s) => s.id === serviceId) ?? null;
}

export async function countServicesByZone(): Promise<Record<BodyZoneId, number>> {
  const supabase = await createClient();
  const counts = {} as Record<BodyZoneId, number>;
  for (const z of SEED_BODY_ZONES) counts[z.id] = 0;

  if (supabase) {
    const { data } = await supabase.from("beauty_body_services").select("zone_id");
    for (const row of data ?? []) {
      const z = row.zone_id as BodyZoneId;
      counts[z] = (counts[z] ?? 0) + 1;
    }
    if (data?.length) return counts;
  }

  for (const s of SEED_BODY_SERVICES) counts[s.zone_id] += 1;
  return counts;
}
