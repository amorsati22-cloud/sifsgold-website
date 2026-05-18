"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  content: string;
  moderated: boolean;
  profiles?: { full_name?: string };
};

export function StreamControlRoom({ streamId }: { streamId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState("scheduled");
  const [viewers, setViewers] = useState(0);
  const [tips, setTips] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rtmp, setRtmp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: stream } = await supabase.from("live_streams").select("*").eq("id", streamId).single();
    if (stream) {
      setStatus(stream.status as string);
      setTips(Number(stream.total_tips_received ?? 0));
      setRtmp((stream.rtmp_url as string) ?? null);
    }
    const { count } = await supabase
      .from("stream_viewers")
      .select("id", { count: "exact", head: true })
      .eq("stream_id", streamId);
    setViewers(count ?? 0);
    const res = await fetch("/api/streams/" + streamId + "/comments");
    if (res.ok) {
      const d = await res.json();
      setComments(d.comments ?? []);
    }
  }, [streamId]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 5000);
    return () => clearInterval(t);
  }, [load]);

  async function goLive() {
    setBusy(true);
    const res = await fetch("/api/streams/" + streamId + "/start", { method: "POST" });
    setBusy(false);
    if (res.ok) void load();
  }

  async function endStream() {
    setBusy(true);
    await fetch("/api/streams/" + streamId + "/end", { method: "POST" });
    setBusy(false);
    router.push("/dashboard/live");
  }

  async function moderate(commentId: string) {
    await fetch("/api/streams/" + streamId + "/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId, moderated: true }),
    });
    void load();
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gold">Control room</h2>
      <p className="text-sm text-cream/70">Status: {status} · Viewers: {viewers} · Tips: ${tips.toFixed(2)}</p>
      {rtmp ? <p className="text-xs text-goldBody break-all">RTMP: {rtmp}</p> : null}
      <div className="flex flex-wrap gap-2">
        {status !== "live" ? (
          <button type="button" disabled={busy} onClick={() => void goLive()} className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy">
            Start broadcast
          </button>
        ) : null}
        <button type="button" disabled={busy} onClick={() => void endStream()} className="rounded-full border border-red-500/50 px-4 py-2 text-sm text-red-300">
          End stream
        </button>
      </div>
      <section>
        <h3 className="text-sm text-gold">Moderation</h3>
        <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
          {comments.map((c) => (
            <li key={c.id} className="flex justify-between gap-2 rounded border border-gold/15 p-2 text-sm">
              <span>{c.profiles?.full_name}: {c.content}</span>
              {!c.moderated ? (
                <button type="button" onClick={() => void moderate(c.id)} className="text-xs text-red-300">Hide</button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
