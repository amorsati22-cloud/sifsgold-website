"use client";

import { useState } from "react";
import type { Thread, ThreadParticipant } from "@/types/messaging";

type Props = {
  thread: Thread;
  participants: ThreadParticipant[];
  userId: string;
  pinnedMessageIds: string[];
  announcement: { title: string; content: string } | null;
  onLeave: () => void;
  onMute: (muted: boolean) => void;
};

export function GroupThreadPanel({
  thread,
  participants,
  userId,
  pinnedMessageIds,
  announcement,
  onLeave,
  onMute,
}: Props) {
  const [open, setOpen] = useState(false);
  const me = participants.find((p) => p.user_id === userId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-brand-md border border-gold/20 px-3 py-1 font-body text-xs text-gold hover:bg-gold/10"
      >
        {participants.length} members
      </button>
      {open && (
        <aside className="absolute right-0 top-14 z-20 h-[calc(100%-3.5rem)] w-64 overflow-y-auto border-l border-gold/15 bg-navy-deep p-4 shadow-xl">
          <h3 className="font-heading text-sm text-gold">Group</h3>
          {thread.group_purpose && (
            <p className="mt-1 font-body text-xs capitalize text-gold-body">{thread.group_purpose.replace(/_/g, " ")}</p>
          )}
          {announcement && (
            <div className="mt-4 rounded-brand-md border border-teal/30 bg-teal/10 p-3">
              <p className="font-body text-xs font-semibold text-teal">{announcement.title}</p>
              <p className="mt-1 font-body text-xs text-cream/80">{announcement.content}</p>
            </div>
          )}
          {pinnedMessageIds.length > 0 && (
            <p className="mt-4 font-body text-xs text-gold-body">{pinnedMessageIds.length} pinned message(s)</p>
          )}
          <ul className="mt-4 space-y-2">
            {participants.map((p) => (
              <li key={p.user_id} className="font-body text-sm text-cream">
                {p.profile?.display_name ?? "Member"}
                {p.role === "admin" && <span className="ml-1 text-xs text-gold">admin</span>}
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={() => onMute(!me?.muted)}
              className="w-full rounded-brand-sm border border-gold/20 py-2 font-body text-xs text-cream"
            >
              {me?.muted ? "Unmute" : "Mute"} notifications
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="w-full rounded-brand-sm border border-red-400/30 py-2 font-body text-xs text-red-300"
            >
              Leave group
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
