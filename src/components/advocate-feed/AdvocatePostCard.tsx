"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FtcDisclosureBlock } from "@/components/advocate-feed/FtcDisclosureBlock";
import { recordPostEngagement } from "@/lib/advocate-feed/actions";
import type { AdvocatePostPublic } from "@/types/challenges-feed";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export function AdvocatePostCard({ post }: { post: AdvocatePostPublic }) {
  const profileHref = post.advocate.username ? `/explore/advocates/${post.advocate.username}` : "#";

  return (
    <article className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-sm text-gold">
          {(post.advocate.display_name[0] ?? "A").toUpperCase()}
        </span>
        <div>
          <Link href={profileHref} className="font-medium text-gold hover:underline">
            {post.advocate.display_name}
          </Link>
          <p className="text-xs text-cream/55">{post.post_type.replace(/_/g, " ")}</p>
        </div>
      </header>
      <Link href={`/explore/advocates/post/${post.id}`} className="mt-4 block">
        <h2 className="font-heading text-lg text-cream">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm text-cream/80">{post.body}</p>
      </Link>
      {post.video_url ? (
        <div className="mt-4 aspect-video overflow-hidden rounded-brand border border-gold/15">
          <ReactPlayer url={post.video_url} width="100%" height="100%" controls />
        </div>
      ) : null}
      {post.image_urls[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image_urls[0]} alt="" className="mt-4 w-full rounded-brand object-cover" />
      ) : null}
      {post.ftc_disclosure_text ? <FtcDisclosureBlock text={post.ftc_disclosure_text} /> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-cream/60">
        <span>{post.view_count} views</span>
        <span>{post.like_count} likes</span>
        <button
          type="button"
          className="text-gold hover:underline"
          onClick={() => void recordPostEngagement(post.id, "like")}
        >
          Like
        </button>
        <Link href={`/explore/advocates/post/${post.id}`} className="text-gold hover:underline">
          Read more
        </Link>
        <Link href={profileHref} className="text-goldBody hover:text-gold">
          Follow advocate
        </Link>
      </div>
    </article>
  );
}
