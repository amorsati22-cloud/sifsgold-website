import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SEED_ADVOCATE_POSTS } from "@/lib/advocate-feed/seed-data";
import type { AdvocatePost, AdvocatePostPublic, AdvocatePostType } from "@/types/challenges-feed";

async function mapPostRow(row: Record<string, unknown>): AdvocatePostPublic {
  const ap = row.advocate_profiles as Record<string, unknown> | null;
  const prof = ap?.profiles as Record<string, unknown> | null;
  return {
    ...(row as unknown as AdvocatePost),
    advocate: {
      id: (ap?.id as string) ?? "",
      display_name: (ap?.display_name as string) ?? "Advocate",
      username: (prof?.username as string) ?? null,
      avatar_url: (prof?.avatar_url as string) ?? null,
      specialty_tags: (ap?.specialty_tags as string[]) ?? (ap?.specialties as string[]) ?? [],
    },
  };
}

export async function listPublishedPosts(opts?: {
  cursor?: number;
  limit?: number;
  postType?: AdvocatePostType;
  brandPartnerOnly?: boolean;
  specialty?: string;
}): Promise<{ posts: AdvocatePostPublic[]; nextCursor: number | null }> {
  const limit = opts?.limit ?? 12;
  const offset = opts?.cursor ?? 0;
  const supabase = await createClient();

  if (supabase) {
    let q = supabase
      .from("advocate_posts")
      .select("*, advocate_profiles(id, display_name, specialties, specialty_tags, profiles(username, avatar_url))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (opts?.postType) q = q.eq("post_type", opts.postType);
    if (opts?.brandPartnerOnly) q = q.eq("post_type", "brand_partner");
    const { data } = await q;
    if (data?.length) {
      let posts = data.map((r) => mapPostRow(r as Record<string, unknown>));
      if (opts?.specialty) {
        posts = posts.filter((p) => p.advocate.specialty_tags.some((t) => t.toLowerCase().includes(opts.specialty!.toLowerCase())));
      }
      const nextCursor = data.length === limit ? offset + limit : null;
      return { posts, nextCursor };
    }
  }

  let list = SEED_ADVOCATE_POSTS.filter((p) => p.status === "published").map((p) => ({
    ...p,
    advocate: {
      id: p.advocate_id,
      display_name: "Sif's Advocate",
      username: "advocate-demo",
      avatar_url: null,
      specialty_tags: ["hair", "education"],
    },
  }));
  if (opts?.postType) list = list.filter((p) => p.post_type === opts.postType);
  return { posts: list.slice(offset, offset + limit), nextCursor: offset + limit < list.length ? offset + limit : null };
}

export async function getPost(postId: string): Promise<AdvocatePostPublic | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("advocate_posts")
      .select("*, advocate_profiles(id, display_name, specialties, specialty_tags, profiles(username, avatar_url))")
      .eq("id", postId)
      .maybeSingle();
    if (data) {
      const post = mapPostRow(data as Record<string, unknown>);
      if (post.status !== "published") return null;
      return post;
    }
  }
  const p = SEED_ADVOCATE_POSTS.find((x) => x.id === postId && x.status === "published");
  if (!p) return null;
  return {
    ...p,
    advocate: {
      id: p.advocate_id,
      display_name: "Sif's Advocate",
      username: "advocate-demo",
      avatar_url: null,
      specialty_tags: ["hair"],
    },
  };
}

export async function getAdvocateByUsername(username: string) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: prof } = await supabase.from("profiles").select("id, username, avatar_url").eq("username", username).maybeSingle();
  if (!prof) return null;
  const { data: ap } = await supabase.from("advocate_profiles").select("*").eq("id", prof.id).maybeSingle();
  if (!ap) return null;
  const { count } = await supabase
    .from("advocate_followers")
    .select("*", { count: "exact", head: true })
    .eq("advocate_id", prof.id);
  const { count: postCount } = await supabase
    .from("advocate_posts")
    .select("*", { count: "exact", head: true })
    .eq("advocate_id", prof.id)
    .eq("status", "published");
  return {
    profile: prof,
    advocate: ap,
    followerCount: count ?? 0,
    postCount: postCount ?? 0,
  };
}

export async function listAdvocatePosts(advocateId: string, limit = 20) {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("advocate_posts")
      .select("*, advocate_profiles(id, display_name, specialties, specialty_tags, profiles(username, avatar_url))")
      .eq("advocate_id", advocateId)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (data?.length) return data.map((r) => mapPostRow(r as Record<string, unknown>));
  }
  const { posts } = await listPublishedPosts({ limit: 50 });
  return posts.filter((p) => p.advocate_id === advocateId).slice(0, limit);
}

export async function getAdvocatePostsForDashboard(advocateId: string) {
  const supabase = await createClient();
  if (!supabase) return SEED_ADVOCATE_POSTS;
  const { data } = await supabase
    .from("advocate_posts")
    .select("*")
    .eq("advocate_id", advocateId)
    .order("created_at", { ascending: false });
  return (data as AdvocatePost[]) ?? [];
}

export async function getPendingReviewQueue() {
  const supabase = await createClient();
  if (!supabase) return { posts: [], checkIns: [] };
  const { data: posts } = await supabase
    .from("advocate_posts")
    .select("*, advocate_profiles(display_name)")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });
  const { data: checkIns } = await supabase
    .from("challenge_check_ins")
    .select("*, beauty_challenges(name), profiles(display_name)")
    .eq("approved", false)
    .not("photo_url", "is", null)
    .order("created_at", { ascending: true });
  return { posts: posts ?? [], checkIns: checkIns ?? [] };
}
