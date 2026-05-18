"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Comment = {
  id: string;
  content: string;
  posted_at: string;
  author_id: string | null;
  highlighted: boolean;
  pinned: boolean;
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
};

type Props = {
  streamId: string;
  userId?: string | null;
};

export function LiveChat({ streamId, userId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/streams/${streamId}/comments`);
    if (res.ok) {
      const data = (await res.json()) as { comments: Comment[] };
      setComments(data.comments);
    }
  }, [streamId]);

  useEffect(() => {
    void load();
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`stream-comments-${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "stream_comments",
          filter: `stream_id=eq.${streamId}`,
        },
        () => void load(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [streamId, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    const res = await fetch(`/api/streams/${streamId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not send");
      return;
    }
    setText("");
    void load();
  }

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/90">
      <h3 className="border-b border-gold/20 px-3 py-2 font-display text-sm text-gold">Live chat</h3>
      <ul className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        {comments.map((c) => (
          <li
            key={c.id}
            className={`rounded-brand-sm px-2 py-1.5 text-sm ${
              c.highlighted
                ? "border border-gold/40 bg-gold/10 text-gold"
                : "bg-navy-lift text-cream/90"
            }`}
          >
            <span className="text-xs text-goldBody">
              {c.profiles?.full_name ?? "Guest"}
            </span>
            <p>{c.content}</p>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
      {error ? (
        <p className="px-3 text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <form onSubmit={(e) => void send(e)} className="border-t border-gold/20 p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!userId}
          placeholder={userId ? "Say something…" : "Sign in to chat"}
          className="w-full rounded-brand-sm border border-gold/30 bg-navy px-2 py-1.5 font-body text-sm text-cream focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
      </form>
    </div>
  );
}
