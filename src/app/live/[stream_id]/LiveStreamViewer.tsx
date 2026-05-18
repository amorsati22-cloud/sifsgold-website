"use client";
import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/live/HlsPlayer";
import { LiveChat } from "@/components/live/LiveChat";
import { TipModal } from "@/components/live/TipModal";
import { createClient } from "@/lib/supabase/client";

export function LiveStreamViewer({ streamId }: { streamId: string }) {
  const [stream, setStream] = useState<Record<string, unknown> | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipSecret, setTipSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(5);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    void supabase.from("live_streams").select("*").eq("id", streamId).single().then(({ data }) => setStream(data));
  }, [streamId]);

  useEffect(() => {
    if (!userId || stream?.status !== "live") return;
    const supabase = createClient();
    void supabase.from("stream_viewers").upsert({ stream_id: streamId, viewer_id: userId });
  }, [streamId, userId, stream?.status]);

  const hls = (stream?.hls_playback_url ?? stream?.recording_url) as string | null;
  const isLive = stream?.status === "live";

  async function openTip() {
    const res = await fetch("/api/streams/" + streamId + "/tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (data.client_secret) {
      setTipSecret(data.client_secret);
      setTipOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HlsPlayer src={hls} poster={stream?.thumbnail_url as string} live={isLive} />
          <h1 className="mt-3 font-heading text-2xl text-gold">{(stream?.title as string) ?? "Stream"}</h1>
          {isLive && stream?.accepts_tips ? (
            <div className="mt-3 flex gap-2">
              <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-20 rounded border border-gold/30 bg-navy-lift px-2 py-1 text-sm" />
              <button type="button" onClick={() => void openTip()} className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy">Tip</button>
            </div>
          ) : null}
        </div>
        <LiveChat streamId={streamId} userId={userId} />
      </div>
      <TipModal open={tipOpen} streamId={streamId} clientSecret={tipSecret} onClose={() => setTipOpen(false)} onSuccess={() => setTipOpen(false)} />
    </div>
  );
}
