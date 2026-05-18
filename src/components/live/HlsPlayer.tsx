"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string | null;
  poster?: string | null;
  live?: boolean;
};

export function HlsPlayer({ src, poster, live = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: { destroy: () => void } | null = null;

    async function setup() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }

      const Hls = (await import("hls.js")).default;
      if (Hls.isSupported()) {
        const instance = new Hls({ enableWorker: true, lowLatencyMode: live });
        instance.loadSource(src);
        instance.attachMedia(video);
        hls = instance;
      }
    }

    void setup();
    return () => {
      hls?.destroy();
    };
  }, [src, live]);

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-brand-lg border border-gold/20 bg-navy-deep">
        <p className="font-body text-sm text-cream/60">
          {live ? "Waiting for broadcast…" : "Recording unavailable"}
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      poster={poster ?? undefined}
      className="aspect-video w-full rounded-brand-lg border border-gold/20 bg-black object-contain"
      aria-label="Live stream video"
    />
  );
}
