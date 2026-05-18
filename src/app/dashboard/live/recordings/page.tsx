import Link from "next/link";
import { requireStreamerDashboardUser } from "@/lib/streaming/require-streamer";

export default async function LiveRecordingsPage() {
  const { supabase, user } = await requireStreamerDashboardUser();
  const { data: streams } = await supabase
    .from("live_streams")
    .select("id, title, recording_url, actual_end, duration_minutes")
    .eq("streamer_id", user.id)
    .eq("status", "ended")
    .order("actual_end", { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-gold">Recordings</h2>
      <ul className="space-y-2">
        {(streams ?? []).map((s) => (
          <li key={s.id as string} className="flex justify-between rounded-brand-md border border-gold/15 px-4 py-3">
            <span className="text-cream">{s.title as string}</span>
            {s.recording_url ? (
              <Link href={"/live/" + s.id} className="text-sm text-gold underline">Watch replay</Link>
            ) : (
              <span className="text-sm text-cream/50">Processing</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
