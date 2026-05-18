import Link from "next/link";
import { format, parseISO } from "date-fns";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireStreamerDashboardUser } from "@/lib/streaming/require-streamer";

export default async function LiveDashboardPage() {
  const { supabase, user } = await requireStreamerDashboardUser();
  const { data: streams } = await supabase
    .from("live_streams")
    .select("id, title, status, scheduled_start, total_tips_received, total_unique_viewers")
    .eq("streamer_id", user.id)
    .order("scheduled_start", { ascending: false })
    .limit(30);

  const live = (streams ?? []).find((s) => s.status === "live");

  return (
    <div className="space-y-6">
      {live ? (
        <p className="rounded-brand-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
          You are live: <Link href={`/dashboard/live/${live.id}/control`} className="text-gold underline">Open control room</Link>
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <GoldButton label="Go live now" href="/dashboard/live/new?now=1" size="sm" />
        <GoldButton label="Schedule stream" href="/dashboard/live/new" variant="outlined" size="sm" />
      </div>
      <ul className="space-y-2">
        {(streams ?? []).map((s) => (
          <li key={s.id as string} className="flex justify-between rounded-brand-md border border-gold/15 px-4 py-3">
            <div>
              <p className="text-cream">{s.title as string}</p>
              <p className="text-xs text-goldBody">{format(parseISO(s.scheduled_start as string), "PPp")} · {s.status as string}</p>
            </div>
            <p className="text-sm text-gold">${Number(s.total_tips_received ?? 0).toFixed(2)} tips</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
