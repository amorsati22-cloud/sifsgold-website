"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { decryptMessage, deriveThreadKey } from "@/lib/messaging/encryption";
import { GoldButton } from "@/components/ui/GoldButton";

type ThreadRow = {
  id: string;
  thread_type: string;
  title: string | null;
  last_message_at: string | null;
  encrypted_last_preview: string | null;
  preview_iv: string | null;
  participant_ids: string[];
  unread_count: number;
  other_participants: { id: string; label: string; username?: string }[];
};

export function ThreadList() {
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/messages/threads")
      .then((r) => r.json())
      .then((data) => {
        setThreads(data.threads ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return threads;
    const lower = q.toLowerCase();
    return threads.filter((t) => {
      const label = threadLabel(t);
      return label.toLowerCase().includes(lower);
    });
  }, [threads, q]);

  function threadLabel(t: ThreadRow) {
    if (t.title) return t.title;
    if (t.other_participants.length > 0) {
      return t.other_participants.map((p) => p.label).join(", ");
    }
    return t.thread_type === "appointment" ? "Appointment thread" : "Conversation";
  }

  function preview(t: ThreadRow) {
    if (!t.encrypted_last_preview || !t.preview_iv) return "No messages yet";
    const key = deriveThreadKey(t.id, t.participant_ids);
    return decryptMessage(t.encrypted_last_preview, t.preview_iv, key) ?? "Encrypted message";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations…"
          className="min-w-[200px] flex-1 rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        />
        <GoldButton label="New message" href="/dashboard/messages/new" variant="solid" size="md" />
      </div>

      {loading ? (
        <p className="font-body text-sm text-gold-body">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-gold-body">No conversations yet.</p>
      ) : (
        <ul className="divide-y divide-gold/10 rounded-brand-lg border border-gold/15">
          {filtered.map((t) => (
            <li key={t.id}>
              <Link
                href={`/dashboard/messages/${t.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
              >
                <div className="min-w-0">
                  <p className="truncate font-body font-medium text-cream">{threadLabel(t)}</p>
                  <p className="truncate font-body text-xs text-gold-body">{preview(t)}</p>
                </div>
                {t.unread_count > 0 ? (
                  <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 font-body text-xs font-semibold text-navy">
                    {t.unread_count}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
