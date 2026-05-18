import type { MDXComponents } from "mdx/types";
import { PullQuote } from "@/app/blog/_components/PullQuote";

export function getBlogMdxComponents(): MDXComponents {
  return {
    PullQuote,
  };
}
