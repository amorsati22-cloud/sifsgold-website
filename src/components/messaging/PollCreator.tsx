"use client";

import { useState } from "react";
import { POLL_EXPIRY_HOURS } from "@/lib/messaging/constants";
import { encryptJson, encryptMessage } from "@/lib/messaging/encryption";
import type { PollData } from "@/types/messaging";

type Props = {
  threadId: string;
  threadKey: Uint8Array;
  onSent: () => void;
  onCancel: () => void;
};

export function PollCreator({ threadId, threadKey, onSent, onCancel }: Props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [expiry, setExpiry] = useState<keyof typeof POLL_EXPIRY_HOURS>("24h");

  async function send() {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || opts.length < 2) return;

    const hours = POLL_EXPIRY_HOURS[expiry];
    const expires_at =
      hours == null ? null : new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const poll: PollData = {
      question: question.trim(),
      options: opts,
      multi_select: multiSelect,
      expires_at,
      allow_edit_vote: true,
    };

    const bodyEnc = encryptJson(poll, threadKey);
    const preview = encryptMessage(`Poll: ${poll.question}`, threadKey);

    await fetch(`/api/messages/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message_type: "poll",
        poll_data: poll,
        encrypted_body: bodyEnc.ciphertext,
        iv: bodyEnc.iv,
        encrypted_preview: preview.ciphertext,
        preview_iv: preview.iv,
      }),
    });
    onSent();
  }

  return (
    <div className="space-y-3 rounded-brand-md border border-gold/20 bg-navy-lift p-4">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll question"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
      />
      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const next = [...options];
            next[i] = e.target.value;
            setOptions(next);
          }}
          placeholder={`Option ${i + 1}`}
          className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
        />
      ))}
      {options.length < 10 && (
        <button
          type="button"
          onClick={() => setOptions([...options, ""])}
          className="font-body text-xs text-gold hover:underline"
        >
          + Add option
        </button>
      )}
      <label className="flex items-center gap-2 font-body text-xs text-cream">
        <input type="checkbox" checked={multiSelect} onChange={(e) => setMultiSelect(e.target.checked)} />
        Allow multiple selections
      </label>
      <select
        value={expiry}
        onChange={(e) => setExpiry(e.target.value as keyof typeof POLL_EXPIRY_HOURS)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
      >
        <option value="1h">Expires in 1 hour</option>
        <option value="24h">Expires in 24 hours</option>
        <option value="7d">Expires in 7 days</option>
        <option value="never">Never</option>
      </select>
      <div className="flex gap-2">
        <button type="button" onClick={() => void send()} className="flex-1 rounded-brand-md bg-gold py-2 text-sm text-navy">
          Send poll
        </button>
        <button type="button" onClick={onCancel} className="rounded-brand-md border border-gold/30 px-4 py-2 text-sm text-gold">
          Cancel
        </button>
      </div>
    </div>
  );
}
