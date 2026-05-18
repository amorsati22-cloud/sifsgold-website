"use client";

import Daily from "@daily-co/daily-js";
import {
  DailyAudio,
  DailyProvider,
  DailyVideo,
  useDaily,
  useDailyEvent,
  useInputSettings,
  useLocalSessionId,
  useParticipantIds,
  useScreenShare,
} from "@daily-co/daily-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InCallChat } from "@/components/video-calls/InCallChat";

type Props = {
  sessionId: string;
  roomUrl: string;
  token: string | null;
  userId: string;
  isHost: boolean;
  recordingEnabled: boolean;
};

function CallControls({
  sessionId,
  isHost,
  recordingEnabled,
}: {
  sessionId: string;
  isHost: boolean;
  recordingEnabled: boolean;
}) {
  const daily = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();
  const { updateInputSettings } = useInputSettings();
  const router = useRouter();
  const [blurOn, setBlurOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [recording, setRecording] = useState(false);

  const toggleBlur = useCallback(async () => {
    if (!daily) return;
    const next = !blurOn;
    await updateInputSettings({
      video: {
        processor: next ? { type: "background-blur", config: { strength: 0.75 } } : { type: "none" },
      },
    });
    setBlurOn(next);
  }, [blurOn, daily, updateInputSettings]);

  const toggleMute = () => {
    daily?.setLocalAudio(!muted);
    setMuted(!muted);
  };

  const toggleVideo = () => {
    daily?.setLocalVideo(!videoOff);
    setVideoOff(!videoOff);
  };

  const toggleScreen = () => {
    if (isSharingScreen) stopScreenShare();
    else startScreenShare();
  };

  const leave = async (endForAll = false) => {
    await fetch(`/api/video-calls/${sessionId}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ end_for_all: endForAll }),
    });
    await daily?.leave();
    router.push(`/dashboard/video-calls/${sessionId}`);
  };

  const toggleRecording = async () => {
    if (!isHost || !recordingEnabled) return;
    if (recording) {
      await daily?.stopRecording();
      setRecording(false);
    } else {
      await daily?.startRecording();
      setRecording(true);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gold/20 bg-navy-deep/95 px-3 py-3">
      <button
        type="button"
        onClick={toggleMute}
        className="rounded-full border border-gold/40 px-3 py-2 font-body text-xs text-cream hover:bg-gold/10 focus:ring-2 focus:ring-gold"
        aria-pressed={muted}
      >
        {muted ? "Unmute" : "Mute"}
      </button>
      <button
        type="button"
        onClick={toggleVideo}
        className="rounded-full border border-gold/40 px-3 py-2 font-body text-xs text-cream hover:bg-gold/10 focus:ring-2 focus:ring-gold"
        aria-pressed={videoOff}
      >
        {videoOff ? "Camera on" : "Camera off"}
      </button>
      <button
        type="button"
        onClick={() => void toggleBlur()}
        className="rounded-full border border-gold/40 px-3 py-2 font-body text-xs text-cream hover:bg-gold/10 focus:ring-2 focus:ring-gold"
        aria-pressed={blurOn}
      >
        {blurOn ? "Blur off" : "Background blur"}
      </button>
      <button
        type="button"
        onClick={toggleScreen}
        className="rounded-full border border-gold/40 px-3 py-2 font-body text-xs text-cream hover:bg-gold/10 focus:ring-2 focus:ring-gold"
      >
        {isSharingScreen ? "Stop share" : "Share screen"}
      </button>
      {isHost && recordingEnabled ? (
        <button
          type="button"
          onClick={() => void toggleRecording()}
          className={`rounded-full border px-3 py-2 font-body text-xs focus:ring-2 focus:ring-gold ${
            recording ? "border-red-400 text-red-300" : "border-gold/40 text-cream"
          }`}
        >
          {recording ? "● Recording" : "Start recording"}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => void leave(false)}
        className="rounded-full bg-gold/20 px-3 py-2 font-body text-xs text-gold hover:bg-gold/30 focus:ring-2 focus:ring-gold"
      >
        Leave
      </button>
      {isHost ? (
        <button
          type="button"
          onClick={() => void leave(true)}
          className="rounded-full border border-red-500/50 px-3 py-2 font-body text-xs text-red-300 hover:bg-red-950/40 focus:ring-2 focus:ring-gold"
        >
          End for all
        </button>
      ) : null}
    </div>
  );
}

function ParticipantGrid() {
  const participantIds = useParticipantIds();
  const localId = useLocalSessionId();

  return (
    <div className="grid flex-1 grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3">
      {participantIds.map((id) => (
        <div
          key={id}
          className={`relative aspect-video overflow-hidden rounded-brand-md bg-navy ${
            id === localId ? "ring-2 ring-gold" : ""
          }`}
        >
          <DailyVideo sessionId={id} type="video" automirror className="h-full w-full object-cover" />
          {id === localId ? (
            <span className="absolute bottom-1 left-1 rounded bg-navy/80 px-1.5 py-0.5 font-body text-xs text-gold">
              You
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CallInner({ sessionId, roomUrl, token, userId, isHost, recordingEnabled }: Props) {
  const daily = useDaily();
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useDailyEvent("joined-meeting", () => setJoined(true));
  useDailyEvent("error", (ev) => setError(ev?.errorMsg ?? "Call error"));

  useEffect(() => {
    if (!daily || joined) return;
    void daily.join({ url: roomUrl, token: token ?? undefined });
  }, [daily, joined, roomUrl, token]);

  if (error) {
    return (
      <p className="p-4 font-body text-red-300" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {recordingEnabled ? (
        <p className="bg-amber-950/50 px-3 py-1 text-center font-body text-xs text-amber-200">
          Recording may be active when enabled by host — all participants must consent first.
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <ParticipantGrid />
          <DailyAudio />
          <CallControls sessionId={sessionId} isHost={isHost} recordingEnabled={recordingEnabled} />
        </div>
        <div className="hidden w-72 md:block">
          <InCallChat sessionId={sessionId} userId={userId} />
        </div>
      </div>
    </div>
  );
}

export function VideoCallRoom(props: Props) {
  const callObject = useMemo(() => Daily.createCallObject(), []);

  useEffect(() => {
    return () => {
      void callObject.destroy();
    };
  }, [callObject]);

  return (
    <DailyProvider callObject={callObject}>
      <CallInner {...props} />
    </DailyProvider>
  );
}
