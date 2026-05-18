"use client";

import { useCallback, useEffect, useState } from "react";

type ChatMessage = {
  id: string;
  message: string;
  sent_at: string;
  sender_id: string | null;
  profiles?: { full_name?: string | null } | null;
};

type Props = {
  sessionId: string;
  userId: string;
};

export function InCallChat({ sessionId, userId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/video-calls/${sessionId}/chat`);
    if (res.ok) {
      const data = (await res.json()) as { messages: ChatMessage[] };
      setMessages(data.messages);
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 4000);
    return () => clearInterval(interval);
  }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch(`/api/video-calls/${sessionId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    setSending(false);
    if (res.ok) {
      setText("");
      void load();
    }
  }

  return (
    <aside className="flex h-full flex-col border-l border-gold/20 bg-navy-deep/90">
      <h3 className="border-b border-gold/20 px-3 py-2 font-display text-sm text-gold">Chat</h3>
      <ul className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded-brand-sm px-2 py-1.5 text-sm ${
              m.sender_id === userId ? "ml-4 bg-gold/15 text-cream" : "mr-4 bg-navy-lift text-cream/90"
            }`}
          >
            <span className="block text-xs text-goldBody">
              {m.profiles?.full_name ?? "Guest"}
            </span>
            {m.message}
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => void send(e)} className="border-t border-gold/20 p-2">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="w-full rounded-brand-sm border border-gold/30 bg-navy px-2 py-1.5 font-body text-sm text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
        />
        <button
          type="submit"
          disabled={sending}
          className="mt-2 w-full rounded-full bg-gold/90 py-1.5 font-body text-xs font-semibold text-navy hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
