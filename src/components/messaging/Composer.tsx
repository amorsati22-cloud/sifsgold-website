"use client";

import { useCallback, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { broadcastTyping } from "@/lib/messaging/realtime";

const EMOJI_QUICK = ["😊", "🙏", "✨", "💛", "👍"];

type Props = {
  threadId: string;
  userId: string;
  replyPreview: string | null;
  onClearReply: () => void;
  onSend: (payload: {
    plaintext: string;
    attachmentFiles: File[];
  }) => Promise<void>;
  disabled?: boolean;
};

export function Composer({
  threadId,
  userId,
  replyPreview,
  onClearReply,
  onSend,
  disabled,
}: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = useCallback(() => {
    if (typingRef.current) clearTimeout(typingRef.current);
    broadcastTyping(threadId, userId);
    typingRef.current = setTimeout(() => {
      typingRef.current = null;
    }, 2000);
  }, [threadId, userId]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;
    setSending(true);
    await onSend({ plaintext: trimmed, attachmentFiles: files });
    setText("");
    setFiles([]);
    setSending(false);
    onClearReply();
  }

  return (
    <div className="border-t border-gold/15 bg-navy-deep/90 p-4">
      {replyPreview ? (
        <div className="mb-2 flex items-center justify-between rounded-brand-md bg-navy/60 px-3 py-2 font-body text-xs text-gold-body">
          <span>Replying: {replyPreview}</span>
          <button type="button" onClick={onClearReply} className="text-gold hover:underline">
            Cancel
          </button>
        </div>
      ) : null}

      {files.length > 0 ? (
        <p className="mb-2 font-body text-xs text-gold-body">{files.length} file(s) attached</p>
      ) : null}

      <div className="flex items-end gap-2">
        <label className="cursor-pointer rounded-full p-2 text-gold-body hover:bg-gold/10 hover:text-gold focus-within:ring-2 focus-within:ring-gold">
          <Paperclip className="h-5 w-5" aria-hidden />
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          className="rounded-full p-2 text-gold-body hover:bg-gold/10 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Emoji"
        >
          <Smile className="h-5 w-5" aria-hidden />
        </button>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          rows={1}
          placeholder="Message…"
          disabled={disabled || sending}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={disabled || sending || (!text.trim() && files.length === 0)}
          className="rounded-full bg-gold p-3 text-navy transition hover:bg-gold-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          aria-label="Send"
        >
          <Send className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {showEmoji ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {EMOJI_QUICK.map((e) => (
            <button
              key={e}
              type="button"
              className="rounded px-2 py-1 text-lg hover:bg-gold/10"
              onClick={() => setText((t) => t + e)}
            >
              {e}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
