"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  onReady: (ready: boolean) => void;
};

export function DeviceCheck({ onReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micOk, setMicOk] = useState(false);
  const [camOk, setCamOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOk(true);
      setMicOk(true);
      onReady(true);
    } catch {
      setError("Camera or microphone permission denied. Allow access in browser settings.");
      setCamOk(false);
      setMicOk(false);
      onReady(false);
    }
  }, [onReady]);

  useEffect(() => {
    void runCheck();
    return () => {
      const v = videoRef.current;
      const stream = v?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [runCheck]);

  return (
    <div className="rounded-brand-lg border border-gold/25 bg-navy-lift p-4">
      <h3 className="font-display text-sm text-gold">Device check</h3>
      <p className="mt-1 font-body text-xs text-cream/70">
        Confirm your camera and microphone work before joining.
      </p>
      <video
        ref={videoRef}
        muted
        playsInline
        className="mt-3 aspect-video w-full max-w-md rounded-brand-sm bg-navy object-cover"
        aria-label="Camera preview"
      />
      <ul className="mt-3 space-y-1 font-body text-sm text-cream">
        <li>{camOk ? "✓" : "○"} Camera</li>
        <li>{micOk ? "✓" : "○"} Microphone</li>
      </ul>
      {error ? (
        <p className="mt-2 font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void runCheck()}
        className="mt-3 rounded-full border border-gold/40 px-4 py-1.5 font-body text-sm text-gold hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
      >
        Test again
      </button>
    </div>
  );
}
