"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { decryptJson, decryptMessage, deriveThreadKey } from "@/lib/messaging/encryption";
import type { Message } from "@/types/messaging";

export type DecryptedMessage = Message & {
  plaintext: string;
  attachments: string[];
};

export function subscribeToThreadMessages(
  threadId: string,
  participantIds: string[],
  onMessage: (message: DecryptedMessage) => void,
) {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = createClient();
  const threadKey = deriveThreadKey(threadId, participantIds);

  const channel = supabase
    .channel(`messages-${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        const row = payload.new as Message;
        if (row.deleted) return;
        const plaintext = decryptMessage(row.encrypted_body, row.iv, threadKey) ?? "[Unable to decrypt]";
        const attachments =
          row.encrypted_attachments && row.attachments_iv
            ? decryptJson<string[]>(row.encrypted_attachments, row.attachments_iv, threadKey) ?? []
            : [];
        onMessage({ ...row, plaintext, attachments });
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        const row = payload.new as Message;
        const plaintext = row.deleted
          ? "[Message deleted]"
          : decryptMessage(row.encrypted_body, row.iv, threadKey) ?? "[Unable to decrypt]";
        const attachments =
          row.encrypted_attachments && row.attachments_iv
            ? decryptJson<string[]>(row.encrypted_attachments, row.attachments_iv, threadKey) ?? []
            : [];
        onMessage({ ...row, plaintext, attachments });
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export function subscribeToTyping(threadId: string, onTyping: (userId: string) => void) {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = createClient();
  const channel = supabase.channel(`typing-${threadId}`);

  channel
    .on("broadcast", { event: "typing" }, (payload) => {
      const userId = payload.payload?.userId as string | undefined;
      if (userId) onTyping(userId);
    })
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export function broadcastTyping(threadId: string, userId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const channel = supabase.channel(`typing-${threadId}`);
  void channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      void channel.send({
        type: "broadcast",
        event: "typing",
        payload: { userId },
      });
    }
  });
}
