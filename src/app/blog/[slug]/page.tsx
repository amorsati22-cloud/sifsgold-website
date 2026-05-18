import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  compilePostMdx,
  formatPostDate,
  generateArticleSchema,
  getAllPosts,
  getMdxComponents,
  getPostBySlug,
  getRelatedPosts,
  tagToSlug,
} from "@/lib/blog";
import { BRAND } from "@/lib/constants";
import { BlogCTA } from "@/app/blog/_components/BlogCTA";
import { PostCard } from "@/app/blog/_components/PostCard";
import { ReadingProgress } from "@/app/blog/_components/ReadingProgress";
import { sifsGoldTheme } from "@/lib/theme";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }

  const url = `${BRAND.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url,
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/blog/${post.slug}/opengraph-image`],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

function heroGradient(slug: string) {
  const { navy, gold, teal } = sifsGoldTheme.colors;
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const accent = hash % 2 === 0 ? gold : teal;
  return `linear-gradient(160deg, ${navy} 0%, ${accent}44 50%, ${navy} 100%)`;
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const MDXContent = await compilePostMdx(post.content);
  const components = getMdxComponents();
  const related = getRelatedPosts(post.slug, post.tags);
  const schema = generateArticleSchema(post);
  const primaryTag = post.tags[0];

  return (
    <article className="min-h-screen bg-navy font-body text-cream">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header
        className="relative border-b border-white/10 px-4 py-20 sm:px-6 md:py-28"
        style={{ background: heroGradient(post.slug) }}
      >
        <div className="relative mx-auto max-w-3xl">
          {primaryTag ? (
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-body">
              {primaryTag}
            </p>
          ) : null}
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-cream/80">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <div
          className={[
            "prose prose-invert max-w-[720px] prose-headings:font-heading prose-headings:text-cream",
            "prose-p:font-body prose-p:text-cream/90 prose-a:text-gold prose-a:no-underline hover:prose-a:underline",
            "prose-strong:text-cream prose-li:text-cream/90",
            "[&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3",
            "[&>p:first-of-type]:first-letter:font-heading [&>p:first-of-type]:first-letter:text-[100px]",
            "[&>p:first-of-type]:first-letter:font-black [&>p:first-of-type]:first-letter:leading-[0.85]",
            "[&>p:first-of-type]:first-letter:text-gold [&>p:first-of-type]:first-letter:pr-1",
          ].join(" ")}
        >
          <MDXContent components={components} />
        </div>

        <div className="mt-16">
          <BlogCTA />
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-white/10 pt-16" aria-labelledby="continue-reading">
            <h2
              id="continue-reading"
              className="font-heading text-2xl font-bold text-cream md:text-3xl"
            >
              Continue reading
            </h2>
            <ul className="mt-8 grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
            <p className="mt-8 font-body text-sm text-cream/70">
              Browse more by tag:{" "}
              {post.tags.map((tag, index) => (
                <span key={tag}>
                  <Link
                    href={`/blog/tag/${tagToSlug(tag)}`}
                    className="text-gold underline-offset-4 hover:underline"
                  >
                    {tag}
                  </Link>
                  {index < post.tags.length - 1 ? ", " : null}
                </span>
              ))}
            </p>
          </section>
        ) : null}
      </div>
    </article>
  );
}
