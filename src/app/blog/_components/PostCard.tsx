"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { formatPostDate, tagToSlug, type PostSummary } from "@/app/blog/utils";
import { TagPill } from "@/app/blog/_components/TagPill";

type PostCardProps = {
  post: PostSummary;
  featured?: boolean;
};

function gradientForSlug(slug: string, gold: string, teal: string, navy: string) {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const angle = 120 + (hash % 80);
  const stop = hash % 2 === 0 ? gold : teal;
  return `linear-gradient(${angle}deg, ${navy} 0%, ${stop}33 45%, ${navy} 100%)`;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const theme = useTheme();
  const href = `/blog/${post.slug}`;

  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-light/20 shadow-sm transition",
        "hover:border-gold/30 focus-within:border-gold/40",
        featured ? "md:col-span-2 lg:col-span-3" : "",
      ].join(" ")}
    >
      <Link href={href} className="flex flex-1 flex-col focus-visible:outline-none">
        <div
          className={[
            "relative min-h-[140px] w-full motion-reduce:transition-none",
            featured ? "min-h-[220px] md:min-h-[280px]" : "",
          ].join(" ")}
          style={{
            background: gradientForSlug(
              post.slug,
              theme.colors.gold,
              theme.colors.teal,
              theme.colors.navy,
            ),
          }}
          aria-hidden
        />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-gold-body">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h2
            className={[
              "mt-3 font-heading font-bold leading-snug text-cream group-hover:text-gold-light",
              featured ? "text-3xl md:text-4xl" : "text-xl",
            ].join(" ")}
          >
            {post.title}
          </h2>
          {post.description ? (
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-cream/75">
              {post.description}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag} tag={tag} href={`/blog/tag/${tagToSlug(tag)}`} />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
