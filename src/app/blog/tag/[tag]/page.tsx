import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getAllTags,
  getPostsByTag,
  slugToTagLabel,
  tagToSlug,
} from "@/lib/blog";
import { PostCard } from "@/app/blog/_components/PostCard";
import { TagPill } from "@/app/blog/_components/TagPill";

type PageProps = {
  params: { tag: string };
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tagToSlug(tag) }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const posts = getAllPosts();
  const label = slugToTagLabel(params.tag, posts);
  if (!label) {
    return { title: "Tag not found" };
  }

  return {
    title: `${label} — Journal`,
    description: `Articles tagged “${label}” from The Sif's Gold Journal.`,
    alternates: {
      canonical: `/blog/tag/${params.tag}`,
    },
  };
}

export default function BlogTagArchivePage({ params }: PageProps) {
  const allPosts = getAllPosts();
  const label = slugToTagLabel(params.tag, allPosts);
  if (!label) {
    notFound();
  }

  const posts = getPostsByTag(label);
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-navy font-body text-cream">
      <header className="border-b border-white/10 px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-body">Tag archive</p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-cream md:text-5xl">{label}</h1>
          <p className="mt-4 max-w-2xl font-body text-cream/75">
            {posts.length} {posts.length === 1 ? "article" : "articles"} in The Sif&apos;s Gold
            Journal.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex font-body text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            ← All posts
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2" aria-label="All tags">
            {tags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                href={`/blog/tag/${tagToSlug(tag)}`}
                active={tagToSlug(tag) === params.tag.toLowerCase()}
              />
            ))}
          </div>

          <ul className="mt-10 grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
