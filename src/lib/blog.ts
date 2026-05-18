import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";
import { BRAND } from "@/lib/constants";
import { getBlogMdxComponents } from "@/app/blog/mdx-components";
import type { Post, PostSummary } from "@/app/blog/utils";
import { slugToTagLabel, tagToSlug } from "@/app/blog/utils";

export type { Post, PostSummary } from "@/app/blog/utils";
export { formatPostDate, slugToTagLabel, tagToSlug } from "@/app/blog/utils";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

function listMdxFilenames(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }
  return fs.readdirSync(BLOG_CONTENT_DIR).filter((name) => name.endsWith(".mdx"));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

function parsePostFile(filename: string): Post {
  const slug = slugFromFilename(filename);
  const raw = fs.readFileSync(path.join(BLOG_CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "The Sif's Gold Team"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: stats.text,
    content: content.trim(),
    ogImage: data.ogImage ? String(data.ogImage) : undefined,
  };
}

export function getAllPosts(): PostSummary[] {
  return listMdxFilenames()
    .map(parsePostFile)
    .map(({ content: _content, ...summary }) => summary)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filename = `${slug}.mdx`;
  if (!listMdxFilenames().includes(filename)) {
    return null;
  }
  return parsePostFile(filename);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getPostsByTag(tag: string): PostSummary[] {
  const normalized = tag.toLowerCase();
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === normalized),
  );
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
): PostSummary[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  return getAllPosts()
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      score: post.tags.filter((t) => tagSet.has(t.toLowerCase())).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function compilePostMdx(source: string) {
  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
    development: process.env.NODE_ENV === "development",
  });
  return MDXContent;
}

export function generateArticleSchema(post: Post) {
  const url = `${BRAND.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: post.ogImage ?? `${BRAND.url}/blog/${post.slug}/opengraph-image`,
    keywords: post.tags.join(", "),
  };
}

export function getMdxComponents(): MDXComponents {
  return getBlogMdxComponents();
}
