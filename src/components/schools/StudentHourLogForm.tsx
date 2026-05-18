"use client";

import { useState } from "react";
import type { SyllabusModule } from "@/types/school";

type Props = { modules: SyllabusModule[] };

export function StudentHourLogForm({ modules }: Props) {
  const [moduleId, setModuleId] = useState(modules[0]?.id ?? "");
  const [hours, setHours] = useState("1");
  const [activity, setActivity] = useState("salon_clinic");
  const [service, setService] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/student/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: moduleId,
        hours: Number(hours),
        activity,
        service_performed: service || null,
      }),
    });
    setMsg(res.ok ? "Submitted for instructor approval." : "Could not submit.");
  }

  return (
    <div className="rounded-brand-lg border border-gold/15 p-4 space-y-3">
      <h3 className="font-heading text-lg text-gold">Log clinic hours</h3>
      <select
        value={moduleId}
        onChange={(e) => setModuleId(e.target.value)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      >
        {modules.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        step="0.25"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      >
        <option value="salon_clinic">Salon clinic</option>
        <option value="theory_lecture">Theory</option>
        <option value="practical_skill_check">Practical</option>
      </select>
      <input
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder="Service performed (optional)"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <button
        type="button"
        onClick={() => void submit()}
        className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
      >
        Submit hours
      </button>
      {msg ? <p className="font-body text-sm text-gold-body">{msg}</p> : null}
    </div>
  );
}
