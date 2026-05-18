"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { schoolId: string; defaultState: string };

export function NewCohortForm({ schoolId, defaultState }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [program, setProgram] = useState("cosmetology");
  const [hours, setHours] = useState("1500");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    const res = await fetch(`/api/schools/${schoolId}/cohorts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        program_type: program,
        state: defaultState,
        required_hours: Number(hours),
        apply_template: true,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
      >
        + New cohort
      </button>
    );
  }

  return (
    <div className="rounded-brand-lg border border-gold/20 bg-navy/50 p-4 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Cohort name"
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <select
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      >
        <option value="cosmetology">Cosmetology</option>
        <option value="barbering">Barbering</option>
        <option value="esthetics">Esthetics</option>
        <option value="nail_tech">Nail tech</option>
      </select>
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void create()}
          disabled={loading || !name}
          className="rounded-brand-sm bg-gold px-4 py-2 text-sm text-navy disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-gold-body">
          Cancel
        </button>
      </div>
    </div>
  );
}
