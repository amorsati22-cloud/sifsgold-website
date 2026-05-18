"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitCheckIn } from "@/lib/challenges/actions";
import { createClient } from "@/lib/supabase/client";

export function CheckInForm({
  challengeId,
  dayNumber,
  prompt,
}: {
  challengeId: string;
  dayNumber: number;
  prompt: string;
}) {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    let photoUrl: string | null = null;
    if (file) {
      const supabase = createClient();
      if (supabase) {
        const path = `${challengeId}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("challenge-checkins").upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from("challenge-checkins").getPublicUrl(path);
          photoUrl = data.publicUrl;
        }
      }
    }
    const res = await submitCheckIn({ challengeId, dayNumber, caption, photoUrl });
    setPending(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not submit.");
      return;
    }
    setMsg(res.pendingReview ? "Submitted for admin review (photo)." : "Check-in published!");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-lg space-y-6">
      <p className="text-sm text-goldBody">Day {dayNumber} prompt</p>
      <p className="text-cream/90">{prompt}</p>
      <div>
        <label className="mb-1 block text-sm text-offwhite" htmlFor="caption">
          Caption
        </label>
        <textarea
          id="caption"
          required
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-offwhite" htmlFor="photo">
          Photo (optional — requires moderation)
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-cream/70"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit check-in"}
      </button>
      {msg ? <p className="text-sm text-goldBody">{msg}</p> : null}
    </form>
  );
}
