"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VideoCallRoom } from "@/components/video-calls/VideoCallRoom";
import { createClient } from "@/lib/supabase/client";

export default function VideoCallRoomPage() {
  const { session_id: sessionId } = useParams<{ session_id: string }>();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Sign in required");
        return;
      }
      setUserId(user.id);

      const startRes = await fetch(`/api/video-calls/${sessionId}/start`, { method: "POST" });
      const startData = (await startRes.json()) as {
        room_url?: string;
        token?: string;
        is_host?: boolean;
        error?: string;
      };
      if (!startRes.ok) {
        setError(startData.error ?? "Failed to start call");
        return;
      }
      setRoomUrl(startData.room_url ?? null);
      setToken(startData.token ?? null);
      setIsHost(Boolean(startData.is_host));

      const { data: session } = await supabase
        .from("video_call_sessions")
        .select("recording_enabled")
        .eq("id", sessionId)
        .single();
      setRecordingEnabled(Boolean(session?.recording_enabled));
    }
    void init();
  }, [sessionId]);

  if (error) {
    return <p className="p-4 font-body text-red-300">{error}</p>;
  }
  if (!roomUrl || !userId) {
    return <p className="p-4 font-body text-cream/70">Loading call…</p>;
  }

  return (
    <VideoCallRoom
      sessionId={sessionId}
      roomUrl={roomUrl}
      token={token}
      userId={userId}
      isHost={isHost}
      recordingEnabled={recordingEnabled}
    />
  );
}
