"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function joinChallenge(challengeId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Sign in to join." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { error } = await supabase.from("challenge_participants").insert({
    challenge_id: challengeId,
    user_id: user.id,
  });
  if (error) return { ok: false, error: error.message };

  await supabase.rpc("increment_challenge_participants", { cid: challengeId }).catch(() => {
    /* optional RPC — ignore */
  });

  revalidatePath(`/challenges/${challengeId}`);
  revalidatePath("/dashboard/challenges");
  return { ok: true };
}

export async function submitCheckIn(input: {
  challengeId: string;
  dayNumber: number;
  caption: string;
  photoUrl?: string | null;
}): Promise<{ ok: boolean; error?: string; pendingReview?: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Sign in required." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const hasPhoto = Boolean(input.photoUrl);
  const approved = !hasPhoto;

  const { error } = await supabase.from("challenge_check_ins").upsert(
    {
      challenge_id: input.challengeId,
      user_id: user.id,
      day_number: input.dayNumber,
      caption: input.caption,
      photo_url: input.photoUrl ?? null,
      approved,
    },
    { onConflict: "challenge_id,user_id,day_number" },
  );
  if (error) return { ok: false, error: error.message };

  if (approved) {
    const { data: part } = await supabase
      .from("challenge_participants")
      .select("days_completed")
      .eq("challenge_id", input.challengeId)
      .eq("user_id", user.id)
      .maybeSingle();
    const days = (part?.days_completed as number) ?? 0;
    await supabase
      .from("challenge_participants")
      .update({ days_completed: Math.max(days, input.dayNumber) })
      .eq("challenge_id", input.challengeId)
      .eq("user_id", user.id);
  }

  revalidatePath(`/challenges/${input.challengeId}`);
  revalidatePath(`/challenges/${input.challengeId}/check-in`);
  revalidatePath("/admin/content-review");
  return { ok: true, pendingReview: hasPhoto };
}
