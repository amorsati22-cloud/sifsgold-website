"use client";

import { useState } from "react";
import { saveCareerPath } from "@/lib/career-paths/actions";
import type { StartingPoint } from "@/types/career-paths";

export function SavePathButton({
  pathId,
  startingPoint,
  targetRoleId,
}: {
  pathId: string;
  startingPoint?: StartingPoint;
  targetRoleId?: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSave() {
    setStatus("saving");
    const res = await saveCareerPath({ pathId, startingPoint, targetRoleId });
    if (!res.ok) {
      setStatus("error");
      setMsg(res.error ?? "Could not save.");
      return;
    }
    setStatus("saved");
    setMsg("Saved to your career plan.");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={status === "saving" || status === "saved"}
        className="rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
      >
        {status === "saved" ? "Saved" : "Save this path"}
      </button>
      {msg ? <p className="mt-2 text-xs text-goldBody">{msg}</p> : null}
    </div>
  );
}
