"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import { RECORDING_RETENTION_DAYS } from "@/lib/video-calls/types";

export default function RecordingPlaybackPage() {
  const { session_id: sessionId } = useParams<{ session_id: string }>();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/video-calls/${sessionId}/recording`);
    if (!res.ok) return;
    const data = (await res.json()) as { download_url?: string; expires_at?: string };
    setDownloadUrl(data.download_url ?? null);
    setExpiresAt(data.expires_at ?? null);
  }, [sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!confirm("Delete this recording permanently?")) return;
    setDeleting(true);
    await fetch(`/api/video-calls/${sessionId}/recording`, { method: "DELETE" });
    setDeleting(false);
    setDownloadUrl(null);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/dashboard/video-calls" className="font-body text-sm text-gold hover:underline">
        ← Back to video calls
      </Link>
      <h1 className="font-display text-2xl text-gold">Call recording</h1>
      <p className="font-body text-sm text-goldBody">
        Recordings auto-delete after {RECORDING_RETENTION_DAYS} days unless saved elsewhere.
        {expiresAt
          ? ` Expires ${new Date(expiresAt).toLocaleDateString()}.`
          : null}
      </p>

      {downloadUrl ? (
        <>
          <video
            controls
            src={downloadUrl}
            className="w-full rounded-brand-md border border-gold/20 bg-navy"
          >
            <track kind="captions" />
          </video>
          <div className="flex flex-wrap gap-2">
            <a
              href={downloadUrl}
              download
              className="rounded-full bg-gold px-4 py-2 font-body text-sm font-semibold text-navy hover:bg-gold-light focus:ring-2 focus:ring-gold"
            >
              Download
            </a>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void handleDelete()}
              className="rounded-full border border-red-500/50 px-4 py-2 font-body text-sm text-red-300 hover:bg-red-950/30 focus:ring-2 focus:ring-gold disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete recording"}
            </button>
          </div>
        </>
      ) : (
        <p className="font-body text-sm text-cream/70">
          Recording is processing or unavailable. Check back shortly.
        </p>
      )}

      <GoldButton label="Return to lobby" href={`/dashboard/video-calls/${sessionId}`} variant="outlined" size="sm" />
    </div>
  );
}
