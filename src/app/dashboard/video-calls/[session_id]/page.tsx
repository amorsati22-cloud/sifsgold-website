"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DeviceCheck } from "@/components/video-calls/DeviceCheck";
import { RecordingConsent } from "@/components/video-calls/RecordingConsent";
import { GoldButton } from "@/components/ui/GoldButton";

type Session = {
  id: string;
  title: string | null;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  recording_enabled: boolean;
  host_id: string;
};

type Participant = {
  id: string;
  role: string;
  recording_consent: boolean;
  profiles?: { full_name?: string; email?: string };
};

export default function VideoCallLobbyPage() {
  const { session_id: sessionId } = useParams<{ session_id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [devicesReady, setDevicesReady] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [pRes] = await Promise.all([
      fetch(`/api/video-calls/${sessionId}/participants`),
    ]);
    if (pRes.ok) {
      const data = (await pRes.json()) as { participants: Participant[] };
      setParticipants(data.participants);
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
    const supabase = import("@/lib/supabase/client").then(({ createClient }) => {
      const client = createClient();
      return client
        .from("video_call_sessions")
        .select("*")
        .eq("id", sessionId)
        .single()
        .then(({ data }) => {
          if (data) {
            setSession(data as Session);
            setNeedsConsent(Boolean(data.recording_enabled));
          }
        });
    });
    void supabase;
  }, [sessionId, load]);

  async function submitConsent(consented: boolean) {
    setConsentLoading(true);
    await fetch(`/api/video-calls/${sessionId}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recording_consent: consented }),
    });
    setConsentLoading(false);
    if (consented) setHasConsented(true);
    void load();
  }

  async function joinCall() {
    setJoining(true);
    setError(null);
    const res = await fetch(`/api/video-calls/${sessionId}/start`, { method: "POST" });
    const data = (await res.json()) as { error?: string; token?: string };
    setJoining(false);
    if (!res.ok) {
      setError(data.error ?? "Could not join");
      return;
    }
    router.push(`/dashboard/video-calls/${sessionId}/room`);
  }

  const canJoin =
    devicesReady && (!needsConsent || hasConsented || !session?.recording_enabled);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/video-calls"
        className="font-body text-sm text-gold hover:underline focus:ring-2 focus:ring-gold"
      >
        ← Back
      </Link>

      <h1 className="font-display text-2xl text-gold">{session?.title ?? "Video call lobby"}</h1>
      <p className="font-body text-sm text-cream/70">Status: {session?.status ?? "…"}</p>

      <section>
        <h2 className="font-display text-sm text-gold">Participants</h2>
        <ul className="mt-2 space-y-1 font-body text-sm text-cream">
          {participants.map((p) => (
            <li key={p.id}>
              {p.profiles?.full_name ?? p.profiles?.email ?? "Invited"}{" "}
              <span className="text-goldBody">({p.role})</span>
              {session?.recording_enabled ? (
                <span className="ml-2 text-xs">
                  {p.recording_consent ? "✓ recording consent" : "○ pending consent"}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <DeviceCheck onReady={setDevicesReady} />

      {needsConsent && session?.recording_enabled && !hasConsented ? (
        <RecordingConsent onConsent={(c) => void submitConsent(c)} loading={consentLoading} />
      ) : null}

      {error ? (
        <p className="font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canJoin || joining}
        onClick={() => void joinCall()}
        className="w-full rounded-full bg-gold py-3 font-body font-semibold text-navy hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {joining ? "Connecting…" : "Join call"}
      </button>
    </div>
  );
}
