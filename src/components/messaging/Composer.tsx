"use client";

import { useCallback, useRef, useState } from "react";
import { Calendar, Mic, Paperclip, BarChart2, Send } from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { broadcastTyping } from "@/lib/messaging/realtime";
import { FileShare } from "@/components/messaging/FileShare";
import { PollCreator } from "@/components/messaging/PollCreator";
import { ScheduledMessageComposer } from "@/components/messaging/ScheduledMessageComposer";
import { VoiceNoteRecorder } from "@/components/messaging/VoiceNote";

const EMOJI_QUICK = ["😊", "🙏", "✨", "💛", "👍"];

type Mode = "text" | "voice" | "file" | "poll" | "schedule";

type Props = {
  threadId: string;
  userId: string;
  threadKey: Uint8Array;
  replyPreview: string | null;
  onClearReply: () => void;
  onSend: (payload: { plaintext: string; attachmentFiles: File[] }) => Promise<void>;
  onRefresh?: () => void;
  disabled?: boolean;
};

export function Composer({
  threadId,
  userId,
  threadKey,
  replyPreview,
  onClearReply,
  onSend,
  onRefresh,
  disabled,
}: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mode, setMode] = useState<Mode>("text");
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

  function closeMode() {
    setMode("text");
    onRefresh?.();
  }

  if (mode === "voice") {
    return (
      <VoiceNoteRecorder threadId={threadId} threadKey={threadKey} onSent={closeMode} onCancel={closeMode} />
    );
  }
  if (mode === "file") {
    return <FileShare threadId={threadId} threadKey={threadKey} onSent={closeMode} />;
  }
  if (mode === "poll") {
    return <PollCreator threadId={threadId} threadKey={threadKey} onSent={closeMode} onCancel={closeMode} />;
  }
  if (mode === "schedule") {
    return (
      <ScheduledMessageComposer
        threadId={threadId}
        threadKey={threadKey}
        onScheduled={closeMode}
        onCancel={closeMode}
      />
    );
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

      <div className="mb-2 flex flex-wrap gap-1">
        <ToolbarButton icon={<Mic className="h-4 w-4" />} label="Voice note" onClick={() => setMode("voice")} />
        <ToolbarButton icon={<Paperclip className="h-4 w-4" />} label="File" onClick={() => setMode("file")} />
        <ToolbarButton icon={<BarChart2 className="h-4 w-4" />} label="Poll" onClick={() => setMode("poll")} />
        <ToolbarButton icon={<Calendar className="h-4 w-4" />} label="Schedule" onClick={() => setMode("schedule")} />
      </div>

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
          onClick={() => setShowEmojiPicker((s) => !s)}
          className="rounded-full p-2 text-gold-body hover:bg-gold/10 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Emoji"
        >
          <span className="text-lg" aria-hidden>
            😊
          </span>
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

      {showEmojiPicker ? (
        <div className="mt-2">
          <EmojiPicker
            onEmojiClick={(e: EmojiClickData) => setText((t) => t + e.emoji)}
            theme={"dark" as never}
            width="100%"
            height={320}
          />
          <div className="mt-1 flex flex-wrap gap-1">
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
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-brand-full border border-gold/20 px-2 py-1 font-body text-[10px] text-gold-body hover:border-gold/40 hover:text-gold"
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
