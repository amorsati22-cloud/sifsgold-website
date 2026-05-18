import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SERVICE_CATEGORIES_FALLBACK, groupCategoriesByParent } from "@/lib/services/categories";
import type { Service, ServiceAddon, ServiceCategoryRow, ServiceWithAddons } from "@/types/services";

const SERVICE_SELECT = `
  *,
  addons:service_addons(*)
`;

function sortAddons<T extends { display_order: number | null }>(addons: T[]): T[] {
  return [...addons].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

function mapServiceRow(row: Record<string, unknown>): ServiceWithAddons {
  const addons = (row.addons as ServiceAddon[] | undefined) ?? [];
  const { addons: _drop, ...rest } = row;
  const service = rest as unknown as Service;
  return {
    ...service,
    addons: sortAddons(addons),
  };
}

export async function getServiceCategories(): Promise<ServiceCategoryRow[]> {
  if (!isSupabaseConfigured()) return SERVICE_CATEGORIES_FALLBACK;

  const supabase = await createClient();
  if (!supabase) return SERVICE_CATEGORIES_FALLBACK;

  const { data } = await supabase
    .from("service_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (data as ServiceCategoryRow[])?.length ? (data as ServiceCategoryRow[]) : SERVICE_CATEGORIES_FALLBACK;
}

export async function getPublicBookableServices(proId: string): Promise<ServiceWithAddons[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("pro_id", proId)
    .eq("visible", true)
    .eq("bookable_online", true)
    .order("display_order", { ascending: true });

  return (data ?? []).map((row) => mapServiceRow(row as Record<string, unknown>));
}

export async function getProServicesForDashboard(proId: string): Promise<ServiceWithAddons[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("pro_id", proId)
    .order("display_order", { ascending: true });

  return (data ?? []).map((row) => mapServiceRow(row as Record<string, unknown>));
}

export async function getServiceById(proId: string, serviceId: string): Promise<ServiceWithAddons | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("pro_id", proId)
    .eq("id", serviceId)
    .maybeSingle();

  if (!data) return null;
  return mapServiceRow(data as Record<string, unknown>);
}

export function groupServicesByCategory(
  services: ServiceWithAddons[],
  categories: ServiceCategoryRow[],
) {
  const groups = groupCategoriesByParent(categories);
  const byCategory = new Map<string, ServiceWithAddons[]>();

  for (const service of services) {
    const key = service.category ?? "other";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(service);
  }

  const orderedKeys: string[] = [];
  for (const g of groups) {
    if (byCategory.has(g.parent.id)) orderedKeys.push(g.parent.id);
    for (const child of g.children) {
      if (byCategory.has(child.id)) orderedKeys.push(child.id);
    }
  }
  for (const key of byCategory.keys()) {
    if (!orderedKeys.includes(key)) orderedKeys.push(key);
  }

  return orderedKeys.map((categoryId) => ({
    categoryId,
    services: byCategory.get(categoryId) ?? [],
  }));
}
