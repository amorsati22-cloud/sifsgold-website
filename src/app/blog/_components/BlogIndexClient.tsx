"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/app/blog/utils";
import { PostCard } from "@/app/blog/_components/PostCard";
import { TagPill } from "@/app/blog/_components/TagPill";

const PAGE_SIZE = 12;

type BlogIndexClientProps = {
  posts: PostSummary[];
  tags: string[];
  showFeatured?: boolean;
};

export function BlogIndexClient({ posts, tags, showFeatured = true }: BlogIndexClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()),
    );
  }, [activeTag, posts]);

  const featured = showFeatured && !activeTag ? filtered[0] : null;
  const gridPosts = showFeatured && !activeTag ? filtered.slice(1) : filtered;
  const visiblePosts = gridPosts.slice(0, visibleCount);
  const hasMore = gridPosts.length > visibleCount;

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        <TagPill
          tag="All"
          active={activeTag === null}
          onClick={() => {
            setActiveTag(null);
            setVisibleCount(PAGE_SIZE);
          }}
        />
        {tags.map((tag) => (
          <TagPill
            key={tag}
            tag={tag}
            active={activeTag?.toLowerCase() === tag.toLowerCase()}
            onClick={() => {
              setActiveTag(tag);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        ))}
      </div>

      {featured ? (
        <div className="mt-10">
          <PostCard post={featured} featured />
        </div>
      ) : null}

      <ul
        className={[
          "mt-10 grid list-none gap-8 p-0",
          featured ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3",
        ].join(" ")}
      >
        {visiblePosts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-12 font-body text-cream/70">No posts match this tag yet.</p>
      ) : null}

      {hasMore ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gold/50 bg-gold/10 px-8 font-body text-sm font-semibold text-gold transition hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
}
