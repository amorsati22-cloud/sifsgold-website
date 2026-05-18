import { getPostBySlug } from "@/lib/blog";
import {
  blogOgContentType,
  blogOgSize,
  createBlogOpenGraphImageResponse,
} from "@/app/blog/_components/blog-og-image";

export const alt = "Sif's Gold blog post";
export const size = blogOgSize;
export const contentType = blogOgContentType;

type Props = {
  params: { slug: string };
};

export default function BlogPostOgImage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? "The Sif's Gold Journal";
  const tag = post?.tags[0];
  return createBlogOpenGraphImageResponse(title, tag);
}
