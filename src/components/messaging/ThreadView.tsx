"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Composer } from "@/components/messaging/Composer";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import {
  decryptJson,
  decryptMessage,
  deriveThreadKey,
  encryptJson,
  encryptMessage,
  previewPlaintext,
} from "@/lib/messaging/encryption";
import {
  subscribeToThreadMessages,
  subscribeToTyping,
  type DecryptedMessage,
} from "@/lib/messaging/realtime";
import type { BubbleStyle, Message, Thread } from "@/types/messaging";
import { createClient } from "@/lib/supabase/client";

type Props = {
  threadId: string;
  userId: string;
  initialThread: Thread;
  initialParticipantIds: string[];
  initialMessages: Message[];
};

export function ThreadView({
  threadId,
  userId,
  initialThread,
  initialParticipantIds,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [participantIds, setParticipantIds] = useState(initialParticipantIds);
  const [replyTo, setReplyTo] = useState<DecryptedMessage | null>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const threadKey = deriveThreadKey(threadId, participantIds);
  const bubbleStyle: BubbleStyle = "gold";

  const decryptRow = useCallback(
    (row: Message): DecryptedMessage => {
      const plaintext = row.deleted
        ? "[Message deleted]"
        : decryptMessage(row.encrypted_body, row.iv, threadKey) ?? "[Unable to decrypt]";
      const attachments =
        row.encrypted_attachments && row.attachments_iv
          ? decryptJson<string[]>(row.encrypted_attachments, row.attachments_iv, threadKey) ?? []
          : [];
      return {
        ...row,
        plaintext,
        attachments,
        reactions: row.reactions ?? [],
      };
    },
    [threadKey],
  );

  useEffect(() => {
    setMessages(initialMessages.map(decryptRow));
  }, [initialMessages, decryptRow]);

  useEffect(() => {
    const unsub = subscribeToThreadMessages(threadId, participantIds, (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === msg.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = msg;
          return next;
        }
        return [...prev, msg];
      });
    });
    return unsub;
  }, [threadId, participantIds]);

  useEffect(() => {
    const unsub = subscribeToTyping(threadId, (uid) => {
      if (uid !== userId) setTypingUser(uid);
      setTimeout(() => setTypingUser(null), 3000);
    });
    return unsub;
  }, [threadId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function uploadAttachments(files: File[]): Promise<string[]> {
    if (files.length === 0) return [];
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of files) {
      const path = `${threadId}/${userId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("message-attachments").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("message-attachments").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function handleSend({
    plaintext,
    attachmentFiles,
  }: {
    plaintext: string;
    attachmentFiles: File[];
  }) {
    const urls = await uploadAttachments(attachmentFiles);
    const { ciphertext, iv } = encryptMessage(plaintext || "(attachment)", threadKey);
    let encrypted_attachments: string | null = null;
    let attachments_iv: string | null = null;
    if (urls.length > 0) {
      const enc = encryptJson(urls, threadKey);
      encrypted_attachments = enc.ciphertext;
      attachments_iv = enc.iv;
    }
    const preview = encryptMessage(previewPlaintext(plaintext || "Attachment"), threadKey);

    const res = await fetch(`/api/messages/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encrypted_body: ciphertext,
        iv,
        encrypted_attachments,
        attachments_iv,
        encrypted_preview: preview.ciphertext,
        preview_iv: preview.iv,
        reply_to_message_id: replyTo?.id ?? null,
      }),
    });

    if (!res.ok) return;
    const data = await res.json();
    const decrypted = decryptRow(data.message as Message);
    setMessages((prev) => {
      if (prev.some((m) => m.id === decrypted.id)) return prev;
      return [...prev, decrypted];
    });
    setReplyTo(null);
  }

  async function handleReact(messageId: string, emoji: string) {
    await fetch(`/api/messages/${messageId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
  }

  async function handleDelete(messageId: string) {
    await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, deleted: true, plaintext: "[Message deleted]" } : m,
      ),
    );
  }

  async function blockOther() {
    const other = participantIds.find((id) => id !== userId);
    if (!other) return;
    await fetch("/api/messages/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked_id: other }),
    });
    router.push("/dashboard/messages");
  }

  const title =
    initialThread.title ??
    (initialThread.thread_type === "appointment" ? "Appointment chat" : "Pass a Note");

  return (
    <div className="flex h-[min(70vh,720px)] flex-col rounded-brand-lg border border-gold/15 bg-navy/30">
      <header className="flex items-center justify-between border-b border-gold/15 px-4 py-3">
        <div>
          <Link href="/dashboard/messages" className="font-body text-xs text-gold hover:underline">
            ← Messages
          </Link>
          <h2 className="font-heading text-lg text-gold">{title}</h2>
          {initialThread.linked_appointment_id ? (
            <Link
              href={`/booking/${initialThread.linked_appointment_id}`}
              className="font-body text-xs text-gold-body hover:text-gold"
            >
              View appointment
            </Link>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-full px-3 py-1 font-body text-sm text-gold-body hover:bg-gold/10 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            ⋮
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-brand-md border border-gold/20 bg-navy-deep py-1 shadow-lg">
              <button
                type="button"
                className="block w-full px-4 py-2 text-left font-body text-sm text-cream hover:bg-white/5"
                onClick={() => void blockOther()}
              >
                Block user
              </button>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left font-body text-sm text-cream hover:bg-white/5"
                onClick={() => {
                  const other = participantIds.find((id) => id !== userId);
                  void fetch("/api/messages/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reported_user_id: other }),
                  });
                  setMenuOpen(false);
                }}
              >
                Report
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <MessageBubble
              message={m}
              isOwn={m.sender_id === userId}
              bubbleStyle={bubbleStyle}
              onReply={setReplyTo}
              onReact={handleReact}
              onDelete={handleDelete}
            />
          </div>
        ))}
        {typingUser ? (
          <p className="font-body text-xs text-gold-body">Typing…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <Composer
        threadId={threadId}
        userId={userId}
        replyPreview={replyTo ? previewPlaintext(replyTo.plaintext, 40) : null}
        onClearReply={() => setReplyTo(null)}
        onSend={handleSend}
      />
    </div>
  );
}
