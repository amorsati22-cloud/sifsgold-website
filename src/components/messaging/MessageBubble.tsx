"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { BubbleStyle } from "@/types/messaging";
import type { DecryptedMessage } from "@/lib/messaging/realtime";

const BUBBLE_STYLES: Record<
  BubbleStyle,
  { sent: string; received: string }
> = {
  gold: {
    sent: "bg-gold text-navy",
    received: "bg-navy/80 border border-gold/20 text-cream",
  },
  minimal: {
    sent: "bg-cream/15 text-cream border border-cream/20",
    received: "bg-navy/60 border border-gold/10 text-cream",
  },
  navy: {
    sent: "bg-navy-deep border border-gold/40 text-gold",
    received: "bg-navy/50 border border-gold/15 text-cream",
  },
};

const REACTIONS = ["❤️", "👍", "😂", "🙏", "✨"];

type Props = {
  message: DecryptedMessage;
  isOwn: boolean;
  bubbleStyle: BubbleStyle;
  onReply: (message: DecryptedMessage) => void;
  onReact: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
};

export function MessageBubble({
  message,
  isOwn,
  bubbleStyle,
  onReply,
  onReact,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = BUBBLE_STYLES[bubbleStyle] ?? BUBBLE_STYLES.gold;
  const body = message.deleted ? "[Message deleted]" : message.plaintext;

  const reactionGroups = (message.reactions ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className={`group flex flex-col ${isOwn ? "items-end" : "items-start"}`}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen(true);
      }}
    >
      <div
        className={`max-w-[85%] rounded-brand-lg px-4 py-2 font-body text-sm ${isOwn ? styles.sent : styles.received}`}
      >
        <p className="whitespace-pre-wrap break-words">{body}</p>
        {message.attachments && message.attachments.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {message.attachments.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs underline ${isOwn ? "text-navy/80" : "text-gold"}`}
                >
                  Attachment
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p className={`mt-1 text-[10px] ${isOwn ? "text-navy/70" : "text-gold-body"}`}>
          {format(new Date(message.created_at), "h:mm a")}
          {message.edited ? " · edited" : ""}
          {isOwn && message.read_by.length > 1 ? " · read" : isOwn ? " · sent" : ""}
        </p>
      </div>

      {Object.keys(reactionGroups).length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {Object.entries(reactionGroups).map(([emoji, count]) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(message.id, emoji)}
              className="rounded-full border border-gold/20 bg-navy/60 px-2 py-0.5 text-xs"
            >
              {emoji} {count > 1 ? count : ""}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-1 flex gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact(message.id, emoji)}
            className="rounded px-1 text-sm hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onReply(message)}
          className="rounded px-2 font-body text-xs text-gold-body hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Reply
        </button>
        {isOwn ? (
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="rounded px-2 font-body text-xs text-red-300/80 hover:text-red-300"
          >
            Delete
          </button>
        ) : null}
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-40"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
