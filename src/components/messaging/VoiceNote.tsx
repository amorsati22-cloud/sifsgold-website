"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, X } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { buildWaveformFromBlob } from "@/lib/messaging/voice-encryption";
import { encryptVoiceBlob } from "@/lib/messaging/voice-encryption";
import { encryptMessage } from "@/lib/messaging/encryption";

type Props = {
  threadId: string;
  threadKey: Uint8Array;
  onSent: () => void;
  onCancel: () => void;
};

export function VoiceNoteRecorder({ threadId, threadKey, onSent, onCancel }: Props) {
  const { recording, duration, start, stop, cancel } = useVoiceRecorder();
  const [uploading, setUploading] = useState(false);
  const [liveBars, setLiveBars] = useState<number[]>(Array(16).fill(10));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    if (!recording) return;
    const tick = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const step = Math.floor(data.length / 16);
        setLiveBars(
          Array.from({ length: 16 }, (_, i) => {
            const v = data[i * step] ?? 0;
            return Math.max(8, Math.round((v / 255) * 100));
          }),
        );
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [recording]);

  async function handleStart() {
    await start();
  }

  async function handleSend() {
    const blob = await stop();
    if (!blob) return;
    setUploading(true);
    const waveform = await buildWaveformFromBlob(blob);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const enc = encryptVoiceBlob(bytes, threadKey);
    const pathEnc = encryptMessage(`${threadId}/voice/${Date.now()}.enc`, threadKey);
    const preview = encryptMessage("Voice message", threadKey);

    await fetch("/api/messages/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_id: threadId,
        encrypted_body: enc.ciphertext,
        iv: enc.iv,
        duration_seconds: duration,
        waveform,
        encrypted_storage_path: pathEnc.ciphertext,
        attachments_iv: pathEnc.iv,
        encrypted_preview: preview.ciphertext,
        preview_iv: preview.iv,
      }),
    });
    setUploading(false);
    onSent();
  }

  const formatDur = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`;

  return (
    <div className="rounded-brand-md border border-gold/25 bg-navy-lift p-4">
      <div className="flex h-12 items-end justify-center gap-0.5">
        {(recording ? liveBars : Array(16).fill(15)).map((h, i) => (
          <span key={i} className="w-1 rounded-full bg-gold/80" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="mt-2 text-center font-body text-xs text-gold-body">{formatDur} / 5:00 max</p>
      <div className="mt-4 flex justify-center gap-3">
        {!recording ? (
          <button
            type="button"
            onClick={() => void handleStart()}
            className="rounded-full bg-gold p-4 text-navy focus:ring-2 focus:ring-gold"
            aria-label="Start recording"
          >
            <Mic className="h-6 w-6" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={uploading}
            className="rounded-full bg-teal p-4 text-navy focus:ring-2 focus:ring-gold"
            aria-label="Stop and send"
          >
            <Square className="h-6 w-6" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            cancel();
            onCancel();
          }}
          className="rounded-full border border-gold/30 p-4 text-gold focus:ring-2 focus:ring-gold"
          aria-label="Cancel"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
