"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveToolPreset(input: {
  toolName: string;
  presetName: string;
  presetData: Record<string, unknown>;
  favorite?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Sign in to save presets." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { error } = await supabase.from("tool_presets").insert({
    user_id: user.id,
    tool_name: input.toolName,
    preset_name: input.presetName,
    preset_data: input.presetData,
    favorite: input.favorite ?? false,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/tools");
  revalidatePath(`/tools/${input.toolName}`);
  return { ok: true };
}

export async function listToolPresets(toolName: string): Promise<
  {
    id: string;
    preset_name: string;
    preset_data: Record<string, unknown>;
    favorite: boolean;
  }[]
> {
  const supabase = await createClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("tool_presets")
    .select("id, preset_name, preset_data, favorite")
    .eq("user_id", user.id)
    .eq("tool_name", toolName)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []) as {
    id: string;
    preset_name: string;
    preset_data: Record<string, unknown>;
    favorite: boolean;
  }[];
}
