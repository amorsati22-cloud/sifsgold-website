"use client";

import { useState } from "react";

type Props = { schoolId: string; cohortId: string };

export function CohortCommunicateForm({ schoolId, cohortId }: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    const res = await fetch(`/api/schools/${schoolId}/cohorts/${cohortId}/communicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });
    const data = await res.json();
    setResult(`Sent to ${data.sent} student(s).`);
  }

  return (
    <div className="rounded-brand-lg border border-gold/15 p-4 space-y-3">
      <h3 className="font-heading text-lg text-gold">Group message</h3>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Message to enrolled students…"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <button
        type="button"
        onClick={() => void send()}
        className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
      >
        Send via email
      </button>
      {result ? <p className="font-body text-sm text-gold-body">{result}</p> : null}
    </div>
  );
}
