"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StartingPoint } from "@/types/career-paths";

export async function saveCareerPath(input: {
  pathId: string;
  startingPoint?: StartingPoint;
  targetRoleId?: string;
  interestedRoleIds?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Sign in to save your path." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { error } = await supabase.from("user_career_interests").upsert({
    id: user.id,
    saved_path_id: input.pathId,
    starting_point: input.startingPoint ?? null,
    target_role: input.targetRoleId ?? null,
    interested_roles: input.interestedRoleIds ?? [],
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/career-plan");
  revalidatePath(`/career-paths/${input.pathId}`);
  return { ok: true };
}

export async function toggleMilestoneProgress(
  milestoneId: string,
  completed: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: row } = await supabase
    .from("user_career_interests")
    .select("milestone_progress")
    .eq("id", user.id)
    .maybeSingle();

  const progress = { ...((row?.milestone_progress as Record<string, boolean>) ?? {}) };
  progress[milestoneId] = completed;

  await supabase.from("user_career_interests").upsert({
    id: user.id,
    milestone_progress: progress,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/dashboard/career-plan");
  return { ok: true };
}

export async function saveQuizResults(roleIds: string[]): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  await supabase.from("user_career_interests").upsert({
    id: user.id,
    interested_roles: roleIds,
    target_role: roleIds[0] ?? null,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/dashboard/career-plan");
  return { ok: true };
}
