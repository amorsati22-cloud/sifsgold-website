"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

export default function NewLiveStreamPage() {
  const router = useRouter();
  const params = useSearchParams();
  const goNow = params.get("now") === "1";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const date = (fd.get("date") as string) || new Date().toISOString().slice(0, 10);
    const time = (fd.get("time") as string) || new Date().toTimeString().slice(0, 5);
    const start = new Date(date + "T" + time);
    const duration = Number(fd.get("duration") || 60);
    const end = new Date(start.getTime() + duration * 60000);

    const res = await fetch("/api/streams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        category: fd.get("category"),
        scheduled_start: start.toISOString(),
        go_live_now: goNow || fd.get("go_live_now") === "on",
        accepts_tips: fd.get("accepts_tips") === "on",
        minimum_tip: Number(fd.get("minimum_tip") || 1),
        visibility: fd.get("visibility") || "public",
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    const id = data.stream?.id;
    if (id) router.push("/dashboard/live/" + id + "/control");
  }

  const input = "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-sm text-cream";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-lg space-y-4">
      <h2 className="font-display text-lg text-gold">Schedule live stream</h2>
      <label className="block text-sm text-cream">Title<input name="title" required className={input} /></label>
      <label className="block text-sm text-cream">Description<textarea name="description" rows={2} className={input} /></label>
      <label className="block text-sm text-cream">Category
        <select name="category" className={input} defaultValue="tutorial">
          <option value="tutorial">Tutorial</option>
          <option value="product_launch">Product launch</option>
          <option value="q_and_a">Q and A</option>
          <option value="class">Class</option>
          <option value="event">Event</option>
        </select>
      </label>
      {!goNow ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm text-cream">Date<input name="date" type="date" className={input} /></label>
          <label className="block text-sm text-cream">Time<input name="time" type="time" className={input} /></label>
        </div>
      ) : (
        <label className="flex items-center gap-2 text-sm"><input name="go_live_now" type="checkbox" defaultChecked /> Go live immediately after create</label>
      )}
      <label className="flex items-center gap-2 text-sm"><input name="accepts_tips" type="checkbox" defaultChecked /> Accept tips</label>
      <label className="block text-sm text-cream">Minimum tip<input name="minimum_tip" type="number" min={1} step={0.01} defaultValue={1} className={input} /></label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button type="submit" disabled={loading} className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-navy disabled:opacity-50">
        {loading ? "Saving…" : "Create stream"}
      </button>
    </form>
  );
}
