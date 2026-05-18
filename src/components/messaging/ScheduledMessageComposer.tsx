"use client";

import { useState } from "react";
import { encryptMessage } from "@/lib/messaging/encryption";

type Props = {
  threadId: string;
  threadKey: Uint8Array;
  onScheduled: () => void;
  onCancel: () => void;
};

export function ScheduledMessageComposer({ threadId, threadKey, onScheduled, onCancel }: Props) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function schedule() {
    if (!text.trim() || !date || !time) return;
    const scheduled = new Date(`${date}T${time}`);
    if (scheduled.getTime() <= Date.now()) return;

    const { ciphertext, iv } = encryptMessage(text.trim(), threadKey);
    const preview = encryptMessage(text.trim().slice(0, 80), threadKey);

    await fetch(`/api/messages/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encrypted_body: ciphertext,
        iv,
        encrypted_preview: preview.ciphertext,
        preview_iv: preview.iv,
        scheduled_for: scheduled.toISOString(),
        delivered: false,
      }),
    });
    onScheduled();
  }

  return (
    <div className="space-y-3 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
      <p className="font-body text-xs text-gold-body">Message sends automatically at the scheduled time (your local timezone).</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Scheduled message…"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
      />
      <div className="flex gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 rounded-brand-sm border border-gold/30 bg-navy px-2 py-2 text-cream" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1 rounded-brand-sm border border-gold/30 bg-navy px-2 py-2 text-cream" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => void schedule()} className="flex-1 rounded-brand-md bg-gold py-2 text-sm text-navy">
          Schedule
        </button>
        <button type="button" onClick={onCancel} className="rounded-brand-md border border-gold/30 px-4 text-sm text-gold">
          Cancel
        </button>
      </div>
    </div>
  );
}
