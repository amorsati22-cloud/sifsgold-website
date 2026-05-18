import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SEED_PATHS, SEED_ROLES_WITH_IDS } from "@/lib/career-paths/seed-data";
import type {
  CareerMilestone,
  CareerPath,
  CareerRole,
  EndRole,
  PathWithDetails,
  StartingPoint,
  UserCareerInterests,
} from "@/types/career-paths";

export async function getCareerUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function seedRole(id: string): CareerRole | undefined {
  return SEED_ROLES_WITH_IDS.find((r) => r.id === id) as CareerRole | undefined;
}

export async function listRoles(filters?: {
  category?: string;
  minSalary?: number;
  maxSalary?: number;
}): Promise<CareerRole[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("career_roles").select("*").order("median_annual_salary", { ascending: false });
    if (filters?.category) q = q.eq("category", filters.category);
    if (filters?.minSalary) q = q.gte("median_annual_salary", filters.minSalary);
    if (filters?.maxSalary) q = q.lte("median_annual_salary", filters.maxSalary);
    const { data } = await q;
    if (data?.length) return data as CareerRole[];
  }
  let list = [...SEED_ROLES_WITH_IDS] as CareerRole[];
  if (filters?.category) list = list.filter((r) => r.category === filters.category);
  if (filters?.minSalary) list = list.filter((r) => r.median_annual_salary >= filters.minSalary!);
  if (filters?.maxSalary) list = list.filter((r) => r.median_annual_salary <= filters.maxSalary!);
  return list.sort((a, b) => b.median_annual_salary - a.median_annual_salary);
}

export async function getRole(roleId: string): Promise<CareerRole | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("career_roles").select("*").eq("id", roleId).maybeSingle();
    if (data) return data as CareerRole;
  }
  return seedRole(roleId) ?? null;
}

export async function listPaths(
  starting?: StartingPoint,
  end?: EndRole,
): Promise<CareerPath[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("career_paths").select("*").order("order_index");
    if (starting) q = q.eq("starting_point", starting);
    if (end) q = q.eq("end_role", end);
    const { data } = await q;
    if (data?.length) return data as CareerPath[];
  }
  return SEED_PATHS.filter(
    (p) => (!starting || p.starting_point === starting) && (!end || p.end_role === end),
  ) as CareerPath[];
}

export async function getPathWithDetails(pathId: string): Promise<PathWithDetails | null> {
  const supabase = await createClient();
  let path: CareerPath | null = null;
  let milestones: CareerMilestone[] = [];
  const roles: (CareerRole & { milestone_order: number })[] = [];

  if (supabase) {
    const { data: p } = await supabase.from("career_paths").select("*").eq("id", pathId).maybeSingle();
    if (p) path = p as CareerPath;
    const { data: ms } = await supabase
      .from("career_milestones")
      .select("*")
      .eq("path_id", pathId)
      .order("milestone_order");
    if (ms) milestones = ms as CareerMilestone[];
    const { data: pr } = await supabase
      .from("career_path_roles")
      .select("milestone_order, career_roles(*)")
      .eq("path_id", pathId);
    if (pr) {
      for (const row of pr) {
        const role = (row as { career_roles: CareerRole }).career_roles;
        roles.push({ ...role, milestone_order: row.milestone_order as number });
      }
    }
  }

  if (!path) {
    const seed = SEED_PATHS.find((p) => p.id === pathId);
    if (!seed) return null;
    path = seed as CareerPath;
    milestones = seed.milestones.map((ms, i) => ({
      id: `seed-ms-${pathId}-${i}`,
      path_id: pathId,
      milestone_order: ms.milestone_order,
      name: ms.name,
      description: ms.description,
      estimated_duration_months: ms.estimated_duration_months,
      estimated_cost: ms.estimated_cost,
      requirements: ms.requirements,
      typical_outcomes: ms.typical_outcomes,
    }));
    for (const ms of seed.milestones) {
      if (ms.role_id) {
        const role = seedRole(ms.role_id);
        if (role) roles.push({ ...role, milestone_order: ms.milestone_order });
      }
    }
  }

  if (!path) return null;
  return { ...path, milestones, roles };
}

export async function getPathsToRole(roleId: string): Promise<CareerPath[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data: links } = await supabase
      .from("career_path_roles")
      .select("path_id")
      .eq("role_id", roleId);
    const ids = (links ?? []).map((l) => l.path_id as string);
    if (ids.length) {
      const { data } = await supabase.from("career_paths").select("*").in("id", ids);
      return (data as CareerPath[]) ?? [];
    }
  }
  const pathIds = new Set<string>();
  for (const p of SEED_PATHS) {
    if (p.milestones.some((m) => m.role_id === roleId)) pathIds.add(p.id);
  }
  return SEED_PATHS.filter((p) => pathIds.has(p.id)) as CareerPath[];
}

export async function getUserCareerInterests(userId: string): Promise<UserCareerInterests | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_career_interests")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as UserCareerInterests) ?? null;
}
