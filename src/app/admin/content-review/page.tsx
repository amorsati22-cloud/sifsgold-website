import type { Metadata } from "next";
import { ContentReviewPanel } from "@/components/admin/ContentReviewPanel";
import { getPendingReviewQueue } from "@/lib/advocate-feed/data";

export const metadata: Metadata = { title: "Content review", robots: { index: false } };

export default async function AdminContentReviewPage() {
  const { posts, checkIns } = await getPendingReviewQueue();

  return (
    <div>
      <h1 className="font-heading text-2xl font-black text-gold">Content review</h1>
      <p className="mt-2 max-w-2xl text-sm text-cream/75">
        Approve advocate posts and photo check-ins before they appear publicly. Text-only check-ins publish
        automatically.
      </p>
      <div className="mt-8">
        <ContentReviewPanel posts={posts} checkIns={checkIns} />
      </div>
    </div>
  );
}
