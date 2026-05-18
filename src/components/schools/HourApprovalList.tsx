"use client";

import { useState } from "react";
import type { HourLog } from "@/types/school";

type Props = { schoolId: string; initialLogs: HourLog[] };

export function HourApprovalList({ schoolId, initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs);

  async function approve(id: string) {
    await fetch(`/api/schools/${schoolId}/hours/${id}/approve`, { method: "POST" });
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  if (logs.length === 0) {
    return <p className="font-body text-sm text-gold-body">No pending hour logs.</p>;
  }

  return (
    <ul className="space-y-2">
      {logs.map((l) => (
        <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-brand-sm border border-gold/15 px-4 py-3">
          <div>
            <p className="font-body text-cream">{l.student_name ?? "Student"}</p>
            <p className="font-body text-xs text-gold-body">
              {l.hours}h · {l.activity.replace(/_/g, " ")} · {new Date(l.logged_at).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void approve(l.id)}
            className="rounded-brand-sm border border-gold/30 px-3 py-1 font-body text-xs text-gold"
          >
            Approve
          </button>
        </li>
      ))}
    </ul>
  );
}
