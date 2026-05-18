"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import { useRouter } from "next/navigation";

type Props = {
  upcomingAppointments: { id: string; label: string }[];
};

export function VisionBoardForm({ upcomingAppointments }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [urls, setUrls] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const image_urls = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    const res = await fetch("/api/client/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title || "Vision board",
        notes,
        image_urls,
        attached_to_appointment: appointmentId || null,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Could not save");
      return;
    }
    router.refresh();
    setTitle("");
    setNotes("");
    setUrls("");
    setAppointmentId("");
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4 rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
      <h3 className="font-heading text-lg text-gold">New vision board</h3>
      <label className="block font-body text-sm">
        <span className="text-gold-body">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block font-body text-sm">
        <span className="text-gold-body">Image URLs (one per line)</span>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={3}
          placeholder="https://..."
          className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="block font-body text-sm">
        <span className="text-gold-body">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
        />
      </label>
      {upcomingAppointments.length > 0 ? (
        <label className="block font-body text-sm">
          <span className="text-gold-body">Attach to appointment (optional)</span>
          <select
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
          >
            <option value="">None</option>
            {upcomingAppointments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <GoldButton
        label={loading ? "Saving…" : "Save vision board"}
        type="submit"
        variant="solid"
        size="md"
        className={loading ? "pointer-events-none opacity-70" : ""}
      />
    </form>
  );
}
