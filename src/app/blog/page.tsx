import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogIndexClient } from "@/app/blog/_components/BlogIndexClient";

export const metadata: Metadata = {
  title: "The Sif's Gold Journal",
  description:
    "Industry essays, craft notes, and the work behind the work from Sif's Gold.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-navy font-body text-cream">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-body">
            The Sif&apos;s Gold Journal
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-bold tracking-tight text-cream md:text-6xl">
            The Sif&apos;s Gold Journal
          </h1>
          <p className="mt-6 max-w-2xl text-pretty font-body text-lg leading-relaxed text-cream/75 sm:text-xl">
            Industry essays, craft notes, and the work behind the work.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlogIndexClient posts={posts} tags={tags} />
        </div>
      </section>
    </div>
  );
}
