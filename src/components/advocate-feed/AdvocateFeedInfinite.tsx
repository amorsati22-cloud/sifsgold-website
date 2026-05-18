"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AdvocatePostCard } from "@/components/advocate-feed/AdvocatePostCard";
import type { AdvocatePostPublic, AdvocatePostType } from "@/types/challenges-feed";

export function AdvocateFeedInfinite({
  initialPosts,
  initialCursor,
  filters,
}: {
  initialPosts: AdvocatePostPublic[];
  initialCursor: number | null;
  filters: { postType?: AdvocatePostType; specialty?: string; brandPartnerOnly?: boolean };
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ rootMargin: "200px" });

  const loadMore = useCallback(async () => {
    if (cursor === null || loading) return;
    setLoading(true);
    const params = new URLSearchParams({ cursor: String(cursor) });
    if (filters.postType) params.set("postType", filters.postType);
    if (filters.specialty) params.set("specialty", filters.specialty);
    if (filters.brandPartnerOnly) params.set("brandPartner", "1");
    const res = await fetch(`/api/explore/advocates/feed?${params}`);
    const json = (await res.json()) as { posts: AdvocatePostPublic[]; nextCursor: number | null };
    setPosts((p) => [...p, ...json.posts]);
    setCursor(json.nextCursor);
    setLoading(false);
  }, [cursor, loading, filters]);

  useEffect(() => {
    setPosts(initialPosts);
    setCursor(initialCursor);
  }, [initialPosts, initialCursor]);

  useEffect(() => {
    if (inView) void loadMore();
  }, [inView, loadMore]);

  return (
    <div className="space-y-6">
      {posts.map((p) => (
        <AdvocatePostCard key={p.id} post={p} />
      ))}
      <div ref={ref} className="py-6 text-center text-sm text-cream/55">
        {loading ? "Loading…" : cursor ? "Scroll for more" : "End of feed"}
      </div>
    </div>
  );
}
