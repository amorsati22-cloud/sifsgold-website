"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { dealKindFromCampaign, generateFtcDisclosure } from "@/lib/advocate-feed/ftc-generator";
import type { AdvocatePostType } from "@/types/challenges-feed";

export async function submitAdvocatePost(input: {
  postType: AdvocatePostType;
  title: string;
  body: string;
  imageUrls: string[];
  videoUrl?: string | null;
  linkedBrandDealId?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Unavailable." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  let ftc: string | null = null;
  if (input.postType === "brand_partner") {
    if (!input.linkedBrandDealId) {
      return { ok: false, error: "Brand partner posts require a linked brand deal." };
    }
    const { data: campaign } = await supabase
      .from("brand_campaigns")
      .select("title, campaign_type, compensation_type")
      .eq("id", input.linkedBrandDealId)
      .maybeSingle();
    if (!campaign) return { ok: false, error: "Brand deal not found." };
    ftc = generateFtcDisclosure({
      brandName: campaign.title as string,
      dealKind: dealKindFromCampaign(
        campaign.campaign_type as string,
        campaign.compensation_type as string,
      ),
      platform: "sifs_gold",
    });
  }

  const { error } = await supabase.from("advocate_posts").insert({
    advocate_id: user.id,
    post_type: input.postType,
    title: input.title,
    body: input.body,
    image_urls: input.imageUrls,
    video_url: input.videoUrl ?? null,
    linked_brand_deal_id: input.linkedBrandDealId ?? null,
    ftc_disclosure_text: ftc,
    status: "pending_review",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/advocate/posts");
  revalidatePath("/admin/content-review");
  return { ok: true };
}

export async function recordPostEngagement(
  postId: string,
  action: "view" | "like" | "save" | "share",
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (action === "view") {
    await supabase.rpc("increment_post_views", { pid: postId }).catch(async () => {
      const { data } = await supabase.from("advocate_posts").select("view_count").eq("id", postId).single();
      if (data) await supabase.from("advocate_posts").update({ view_count: (data.view_count as number) + 1 }).eq("id", postId);
    });
    return { ok: true };
  }

  if (!user) return { ok: false };
  const { error } = await supabase.from("post_engagement").upsert(
    { post_id: postId, user_id: user.id, action },
    { onConflict: "post_id,user_id,action", ignoreDuplicates: true },
  );
  if (!error && action === "like") {
    const { data } = await supabase.from("advocate_posts").select("like_count").eq("id", postId).single();
    if (data) await supabase.from("advocate_posts").update({ like_count: (data.like_count as number) + 1 }).eq("id", postId);
  }
  revalidatePath(`/explore/advocates/post/${postId}`);
  return { ok: !error };
}

export async function followAdvocate(advocateId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase.from("advocate_followers").upsert({ advocate_id: advocateId, user_id: user.id });
  revalidatePath("/explore/advocates");
  return { ok: true };
}

export async function moderatePost(
  postId: string,
  decision: "published" | "rejected",
): Promise<{ ok: boolean }> {
  const admin = createAdminClient();
  await admin
    .from("advocate_posts")
    .update({
      status: decision,
      published_at: decision === "published" ? new Date().toISOString() : null,
    })
    .eq("id", postId);
  revalidatePath("/admin/content-review");
  revalidatePath("/explore/advocates");
  return { ok: true };
}

export async function moderateCheckIn(checkInId: string, approved: boolean): Promise<{ ok: boolean }> {
  const admin = createAdminClient();
  const { data: row } = await admin.from("challenge_check_ins").select("*").eq("id", checkInId).single();
  if (!row) return { ok: false };
  await admin.from("challenge_check_ins").update({ approved }).eq("id", checkInId);
  if (approved) {
    await admin
      .from("challenge_participants")
      .update({ days_completed: row.day_number as number })
      .eq("challenge_id", row.challenge_id)
      .eq("user_id", row.user_id);
  }
  revalidatePath("/admin/content-review");
  return { ok: true };
}

export async function bulkModeratePosts(postIds: string[], decision: "published" | "rejected") {
  for (const id of postIds) await moderatePost(id, decision);
  return { ok: true };
}
