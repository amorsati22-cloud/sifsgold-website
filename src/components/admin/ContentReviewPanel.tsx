"use client";

import { useState } from "react";
import { bulkModeratePosts, moderateCheckIn, moderatePost } from "@/lib/advocate-feed/actions";

type PostRow = {
  id: string;
  title: string;
  post_type: string;
  advocate_profiles?: { display_name: string };
};

type CheckInRow = {
  id: string;
  day_number: number;
  caption: string | null;
  beauty_challenges?: { name: string };
  profiles?: { display_name: string };
};

export function ContentReviewPanel({
  posts,
  checkIns,
}: {
  posts: PostRow[];
  checkIns: CheckInRow[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-gold">Advocate posts ({posts.length})</h2>
          <button
            type="button"
            className="text-sm text-gold"
            onClick={() => void bulkModeratePosts([...selected], "published")}
          >
            Bulk approve selected
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-brand border border-gold/20 p-4">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                <span>
                  <span className="font-medium text-cream">{p.title}</span>
                  <span className="ml-2 text-xs text-cream/55">{p.post_type}</span>
                  <span className="block text-xs text-goldBody">
                    {p.advocate_profiles?.display_name ?? "Advocate"}
                  </span>
                </span>
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="text-xs text-teal"
                  onClick={() => void moderatePost(p.id, "published")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="text-xs text-cream/60"
                  onClick={() => void moderatePost(p.id, "rejected")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="text-xs text-goldBody"
                  onClick={() => void moderatePost(p.id, "rejected")}
                >
                  Request changes
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl text-gold">Challenge check-ins with photos ({checkIns.length})</h2>
        <ul className="mt-4 space-y-3">
          {checkIns.map((c) => (
            <li key={c.id} className="rounded-brand border border-gold/20 p-4 text-sm">
              <p className="text-cream">
                {c.beauty_challenges?.name} — day {c.day_number} — {c.profiles?.display_name}
              </p>
              <p className="mt-1 text-cream/75">{c.caption}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="text-xs text-teal" onClick={() => void moderateCheckIn(c.id, true)}>
                  Approve
                </button>
                <button type="button" className="text-xs text-cream/60" onClick={() => void moderateCheckIn(c.id, false)}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
