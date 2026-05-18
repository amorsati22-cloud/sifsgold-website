"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

const SESSION_TYPES = [
  { value: "consultation", label: "1:1 consultation" },
  { value: "class", label: "Group class" },
  { value: "brand_meeting", label: "Brand partner meeting" },
  { value: "support", label: "Support" },
] as const;

export default function NewVideoCallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const date = fd.get("date") as string;
    const time = fd.get("time") as string;
    const duration = Number(fd.get("duration") || 30);
    const tz = (fd.get("timezone") as string) || "America/Chicago";
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + duration * 60 * 1000);

    const emails = (fd.get("invite_emails") as string)
      .split(/[,;\s]+/)
      .map((x) => x.trim())
      .filter(Boolean);

    const res = await fetch("/api/video-calls/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        session_type: fd.get("session_type"),
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        timezone: tz,
        max_participants: Number(fd.get("max_participants") || 4),
        recording_enabled: fd.get("recording_enabled") === "on",
        linked_appointment_id: (fd.get("appointment_id") as string) || undefined,
        participant_emails: emails,
      }),
    });
    setLoading(false);
    const data = (await res.json()) as { session?: { id: string }; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Failed to schedule");
      return;
    }
    router.push(`/dashboard/video-calls/${data.session?.id}`);
  }

  const inputClass =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-lg space-y-4">
      <h2 className="font-display text-lg text-gold">Schedule video call</h2>

      <label className="block font-body text-sm text-cream">
        Title
        <input name="title" required className={inputClass} />
      </label>

      <label className="block font-body text-sm text-cream">
        Description
        <textarea name="description" rows={2} className={inputClass} />
      </label>

      <label className="block font-body text-sm text-cream">
        Type
        <select name="session_type" className={inputClass} defaultValue="consultation">
          {SESSION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block font-body text-sm text-cream">
          Date
          <input name="date" type="date" required className={inputClass} />
        </label>
        <label className="block font-body text-sm text-cream">
          Time
          <input name="time" type="time" required className={inputClass} />
        </label>
      </div>

      <label className="block font-body text-sm text-cream">
        Timezone
        <input name="timezone" defaultValue="America/Chicago" className={inputClass} />
      </label>

      <label className="block font-body text-sm text-cream">
        Duration (minutes)
        <input name="duration" type="number" min={15} max={180} defaultValue={30} className={inputClass} />
      </label>

      <label className="block font-body text-sm text-cream">
        Max participants
        <input name="max_participants" type="number" min={2} max={50} defaultValue={4} className={inputClass} />
      </label>

      <label className="flex items-center gap-2 font-body text-sm text-cream">
        <input
          name="recording_enabled"
          type="checkbox"
          className="rounded border-gold/40 text-gold focus:ring-gold"
        />
        Enable recording (requires consent from all participants)
      </label>

      <label className="block font-body text-sm text-cream">
        Link existing appointment ID (optional)
        <input name="appointment_id" className={inputClass} placeholder="uuid" />
      </label>

      <label className="block font-body text-sm text-cream">
        Invite by email (comma-separated)
        <input name="invite_emails" className={inputClass} placeholder="client@example.com" />
      </label>

      {error ? (
        <p className="font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gold px-6 py-2 font-body text-sm font-semibold text-navy hover:bg-gold-light focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          {loading ? "Scheduling…" : "Schedule call"}
        </button>
        <GoldButton label="Cancel" href="/dashboard/video-calls" variant="outlined" size="sm" />
      </div>
    </form>
  );
}
