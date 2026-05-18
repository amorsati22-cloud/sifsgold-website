"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAffirmationById, getNextAffirmationForUser } from "@/lib/affirmations/data";
import type { AffirmationAudience } from "@/types/affirmations";

export async function recordAffirmationShown(
  affirmationId: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  await supabase.from("user_affirmation_history").insert({
    user_id: user.id,
    affirmation_id: affirmationId,
    saved: false,
  });
  return { ok: true };
}

export async function saveAffirmation(
  affirmationId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Sign in to save affirmations." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { data: existing } = await supabase
    .from("user_affirmation_history")
    .select("id")
    .eq("user_id", user.id)
    .eq("affirmation_id", affirmationId)
    .order("shown_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("user_affirmation_history").update({ saved: true }).eq("id", existing.id);
  } else {
    await supabase.from("user_affirmation_history").insert({
      user_id: user.id,
      affirmation_id: affirmationId,
      saved: true,
    });
  }

  revalidatePath("/daily");
  revalidatePath("/daily/saved");
  return { ok: true };
}

export async function shareAffirmation(
  affirmationId: string,
  platform: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  await supabase.from("user_affirmation_history").insert({
    user_id: user.id,
    affirmation_id: affirmationId,
    shared_to_platform: platform,
  });
  return { ok: true };
}

export async function fetchNextAffirmation(audience: AffirmationAudience): Promise<{
  ok: boolean;
  affirmation?: { id: string; text: string; category: string };
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) {
    const next = await getNextAffirmationForUser(user.id, audience);
    if (next) {
      await recordAffirmationShown(next.id);
      return { ok: true, affirmation: { id: next.id, text: next.text, category: next.category } };
    }
  }

  const { getTodaysAffirmation } = await import("@/lib/affirmations/data");
  const fallback = await getTodaysAffirmation(audience);
  if (!fallback) return { ok: false };
  return { ok: true, affirmation: { id: fallback.id, text: fallback.text, category: fallback.category } };
}
