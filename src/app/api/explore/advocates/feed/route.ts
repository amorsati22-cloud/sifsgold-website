import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/advocate-feed/data";
import type { AdvocatePostType } from "@/types/challenges-feed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = Number.parseInt(searchParams.get("cursor") ?? "0", 10);
  const postType = searchParams.get("postType") as AdvocatePostType | null;
  const specialty = searchParams.get("specialty") ?? undefined;
  const brandPartnerOnly = searchParams.get("brandPartner") === "1";

  const { posts, nextCursor } = await listPublishedPosts({
    cursor,
    limit: 12,
    postType: postType ?? undefined,
    specialty,
    brandPartnerOnly,
  });

  return NextResponse.json({ posts, nextCursor });
}
