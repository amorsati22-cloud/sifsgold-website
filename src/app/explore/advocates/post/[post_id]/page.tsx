import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FtcDisclosureBlock } from "@/components/advocate-feed/FtcDisclosureBlock";
import { PostEngagementTracker } from "@/components/advocate-feed/PostEngagementTracker";
import { recordPostEngagement } from "@/lib/advocate-feed/actions";
import { getPost } from "@/lib/advocate-feed/data";
import { BRAND } from "@/lib/constants";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type Props = { params: { post_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.post_id);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    alternates: { canonical: `${BRAND.url}/explore/advocates/post/${post.id}` },
  };
}

export default async function AdvocatePostPage({ params }: Props) {
  const post = await getPost(params.post_id);
  if (!post) notFound();

  const profileHref = post.advocate.username
    ? `/explore/advocates/${post.advocate.username}`
    : "/explore/advocates";

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <PostEngagementTracker postId={post.id} />
      <Breadcrumb
        items={[
          { name: "Advocates", href: "/explore/advocates" },
          { name: post.title, href: `/explore/advocates/post/${post.id}` },
        ]}
      />
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 md:px-8">
        <header className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            {(post.advocate.display_name[0] ?? "A").toUpperCase()}
          </span>
          <div>
            <Link href={profileHref} className="font-heading text-lg text-gold hover:underline">
              {post.advocate.display_name}
            </Link>
            <p className="text-xs text-cream/55">{post.post_type.replace(/_/g, " ")}</p>
          </div>
        </header>

        <h1 className="mt-6 font-heading text-3xl text-gold">{post.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-cream/90">{post.body}</p>

        {post.ftc_disclosure_text ? (
          <div className="mt-6">
            <FtcDisclosureBlock text={post.ftc_disclosure_text} prominent />
          </div>
        ) : null}

        {post.video_url ? (
          <div className="mt-8 aspect-video overflow-hidden rounded-brand border border-gold/15">
            <ReactPlayer url={post.video_url} width="100%" height="100%" controls />
          </div>
        ) : null}

        {post.image_urls.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt="" className="mt-6 w-full rounded-brand object-cover" />
        ))}

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-cream/60">
          <span>{post.view_count} views</span>
          <span>{post.like_count} likes</span>
          <form
            action={async () => {
              "use server";
              await recordPostEngagement(post.id, "like");
            }}
          >
            <button type="submit" className="text-gold hover:underline">
              Like
            </button>
          </form>
        </div>

        <Link href={profileHref} className="mt-8 inline-block rounded-full border border-gold px-5 py-2 text-sm text-gold">
          Visit advocate profile
        </Link>

        <section className="mt-12 border-t border-gold/15 pt-8" aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="font-heading text-xl text-gold">
            Comments
          </h2>
          <p className="mt-3 text-sm text-cream/70">
            Community comments are moderated. Check back soon — we&apos;re rolling out threaded discussion on web.
          </p>
        </section>
      </div>
    </article>
  );
}
