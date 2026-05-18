"use client";

import { useCallback, useRef, useState } from "react";
import { VOICE_NOTE_MAX_SECONDS } from "@/lib/messaging/constants";

export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4" });
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.start(200);
    setRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration((d) => {
        if (d + 1 >= VOICE_NOTE_MAX_SECONDS) {
          mediaRecorderRef.current?.stop();
        }
        return d + 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const mr = mediaRecorderRef.current;
      if (!mr || mr.state === "inactive") {
        setRecording(false);
        stopTracks();
        resolve(null);
        return;
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType });
        setRecording(false);
        stopTracks();
        resolve(blob);
      };
      mr.stop();
    });
  }, [stopTracks]);

  const cancel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    chunksRef.current = [];
    setRecording(false);
    setDuration(0);
    stopTracks();
  }, [stopTracks]);

  return { recording, duration, start, stop, cancel };
}
