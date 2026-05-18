import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireAdvocateDashboard } from "@/lib/advocates/require-dashboard";
import { getAdvocatePostsForDashboard } from "@/lib/advocate-feed/data";
import { ADVOCATE_DASHBOARD_NAV } from "@/lib/dashboard/advocate-nav";

export default async function AdvocatePostsPage() {
  const { user } = await requireAdvocateDashboard();
  const posts = await getAdvocatePostsForDashboard(user.id);

  const drafts = posts.filter((p) => p.status !== "published");
  const published = posts.filter((p) => p.status === "published");

  return (
    <DashboardShell
      title="Posts"
      description="Manage advocate content — submissions are reviewed before going public."
      nav={ADVOCATE_DASHBOARD_NAV}
    >
      <GoldButton label="+ New post" href="/dashboard/advocate/posts/new" variant="solid" size="sm" className="mb-8" />

      <h2 className="font-heading text-xl text-gold">Pending / drafts</h2>
      <ul className="mt-4 mb-10 space-y-3">
        {drafts.length === 0 ? (
          <li className="text-sm text-gold-body">No pending posts.</li>
        ) : (
          drafts.map((p) => (
            <li key={p.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <p className="font-heading text-lg text-gold">{p.title}</p>
              <p className="text-xs text-cream/60">{p.status.replace(/_/g, " ")} · {p.post_type}</p>
            </li>
          ))
        )}
      </ul>

      <h2 className="font-heading text-xl text-gold">Published</h2>
      <ul className="mt-4 space-y-3">
        {published.length === 0 ? (
          <li className="text-sm text-gold-body">No published posts yet.</li>
        ) : (
          published.map((p) => (
            <li key={p.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <Link href={`/explore/advocates/post/${p.id}`} className="font-heading text-lg text-gold hover:underline">
                {p.title}
              </Link>
              <p className="text-xs text-cream/60">
                {p.view_count} views · {p.like_count} likes
              </p>
            </li>
          ))
        )}
      </ul>
    </DashboardShell>
  );
}
