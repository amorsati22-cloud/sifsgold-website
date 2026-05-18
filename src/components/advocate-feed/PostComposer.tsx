"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateFtcDisclosure, dealKindFromCampaign } from "@/lib/advocate-feed/ftc-generator";
import { submitAdvocatePost } from "@/lib/advocate-feed/actions";
import { createClient } from "@/lib/supabase/client";
import { FtcDisclosureBlock } from "@/components/advocate-feed/FtcDisclosureBlock";
import type { AdvocatePostType } from "@/types/challenges-feed";

type DealOption = { id: string; title: string; campaign_type: string; compensation_type: string };

export function PostComposer({ brandDeals }: { brandDeals: DealOption[] }) {
  const router = useRouter();
  const [postType, setPostType] = useState<AdvocatePostType>("tip");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dealId, setDealId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const selectedDeal = brandDeals.find((d) => d.id === dealId);
  const previewFtc =
    postType === "brand_partner" && selectedDeal
      ? generateFtcDisclosure({
          brandName: selectedDeal.title,
          dealKind: dealKindFromCampaign(selectedDeal.campaign_type, selectedDeal.compensation_type),
        })
      : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const urls: string[] = [];
    const supabase = createClient();
    if (files && supabase) {
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("advocate-posts").upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from("advocate-posts").getPublicUrl(path);
          urls.push(data.publicUrl);
        }
      }
    }
    const res = await submitAdvocatePost({
      postType,
      title,
      body,
      imageUrls: urls,
      videoUrl: videoUrl || null,
      linkedBrandDealId: postType === "brand_partner" ? dealId : null,
    });
    setMsg(res.ok ? "Submitted for admin review." : res.error ?? "Failed.");
    if (res.ok) router.push("/dashboard/advocate/posts");
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-offwhite">Post type</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["tip", "tutorial", "before_after", "brand_partner"] as AdvocatePostType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPostType(t)}
              className={`rounded-full border px-3 py-1 text-xs ${
                postType === t ? "border-gold bg-gold text-navy" : "border-gold/30 text-gold"
              }`}
            >
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
      {postType === "brand_partner" ? (
        <select
          value={dealId}
          onChange={(e) => setDealId(e.target.value)}
          required
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
        >
          <option value="">Select brand deal</option>
          {brandDeals.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      ) : null}
      {previewFtc ? <FtcDisclosureBlock text={previewFtc} prominent /> : null}
      <input
        placeholder="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      />
      <textarea
        placeholder="Body"
        required
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      />
      <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      <input
        placeholder="Video URL (YouTube/Vimeo)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      />
      <button type="submit" className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy">
        Submit for review
      </button>
      {msg ? <p className="text-sm text-goldBody">{msg}</p> : null}
    </form>
  );
}
