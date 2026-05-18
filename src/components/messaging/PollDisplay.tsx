"use client";

import { useEffect, useState } from "react";
import type { Message, PollData } from "@/types/messaging";

type Props = {
  message: Message;
  poll: PollData;
  userId: string;
  isOwn: boolean;
};

export function PollDisplay({ message, poll, userId, isOwn }: Props) {
  const [tally, setTally] = useState<Record<string, number>>(message.poll_tally ?? {});
  const [myVote, setMyVote] = useState<string[]>(message.poll_my_vote ?? []);
  const [voted, setVoted] = useState(myVote.length > 0);
  const total = Object.values(tally).reduce((a, b) => a + b, 0);

  useEffect(() => {
    void fetch(`/api/polls/${message.id}/vote`, { method: "GET" }).catch(() => {});
  }, [message.id]);

  async function vote(selected: string[]) {
    const res = await fetch(`/api/polls/${message.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_options: selected }),
    });
    const data = await res.json();
    if (res.ok) {
      setTally(data.tally ?? {});
      setMyVote(selected);
      setVoted(true);
    }
  }

  function toggleOption(opt: string) {
    if (poll.multi_select) {
      const next = myVote.includes(opt) ? myVote.filter((o) => o !== opt) : [...myVote, opt];
      void vote(next);
    } else {
      void vote([opt]);
    }
  }

  const expired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;

  return (
    <div className={`max-w-[85%] rounded-brand-lg border border-gold/25 p-4 ${isOwn ? "bg-gold/10" : "bg-navy/80"}`}>
      <p className="font-heading text-sm text-gold">{poll.question}</p>
      <ul className="mt-3 space-y-2">
        {poll.options.map((opt) => {
          const count = tally[opt] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={expired && !poll.allow_edit_vote}
                onClick={() => toggleOption(opt)}
                className="relative w-full overflow-hidden rounded-brand-sm border border-gold/20 px-3 py-2 text-left font-body text-sm text-cream disabled:opacity-60"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-gold/20"
                  style={{ width: voted ? `${pct}%` : "0%" }}
                />
                <span className="relative flex justify-between">
                  <span>{opt}</span>
                  {voted && <span className="text-gold-body">{pct}%</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 font-body text-[10px] text-gold-body">
        {total} vote{total === 1 ? "" : "s"}
        {expired ? " · ended" : ""}
        {voted && poll.allow_edit_vote ? (
          <button type="button" className="ml-2 text-gold underline" onClick={() => setVoted(false)}>
            Edit vote
          </button>
        ) : null}
      </p>
    </div>
  );
}
