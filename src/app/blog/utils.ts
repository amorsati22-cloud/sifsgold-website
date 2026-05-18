export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  content: string;
  ogImage?: string;
};

export type PostSummary = Omit<Post, "content">;

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function slugToTagLabel(slug: string, posts: PostSummary[]): string | null {
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tagToSlug(tag) === slug.toLowerCase()) {
        return tag;
      }
    }
  }
  return null;
}
