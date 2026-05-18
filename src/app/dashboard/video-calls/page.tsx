import Link from "next/link";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { GoldButton } from "@/components/ui/GoldButton";
import { MilestoneGate } from "@/components/video-calls/MilestoneGate";
import { requireProDashboardUser } from "@/lib/dashboard";
import { isVideoCallsUnlocked } from "@/lib/video-calls/milestone";
import { createClient } from "@/lib/supabase/server";

export default async function VideoCallsPage() {
  const { user } = await requireProDashboardUser();
  const milestone = await isVideoCallsUnlocked();

  if (!milestone.unlocked) {
    return <MilestoneGate count={milestone.count} required={milestone.required} userId={user.id} />;
  }

  const supabase = await createClient();
  const now = new Date();

  const { data: upcoming } = supabase
    ? await supabase
        .from("video_call_sessions")
        .select("id, title, scheduled_start, scheduled_end, status, session_type")
        .eq("host_id", user.id)
        .in("status", ["scheduled", "in_progress"])
        .gte("scheduled_end", now.toISOString())
        .order("scheduled_start", { ascending: true })
    : { data: [] };

  const { data: past } = supabase
    ? await supabase
        .from("video_call_sessions")
        .select("id, title, scheduled_start, status, recording_url")
        .eq("host_id", user.id)
        .in("status", ["ended", "cancelled", "no_show"])
        .order("scheduled_start", { ascending: false })
        .limit(20)
    : { data: [] };

  const activeNow = (upcoming ?? []).find((s) => {
    const start = parseISO(s.scheduled_start as string);
    const end = parseISO(s.scheduled_end as string);
    return (
      s.status === "in_progress" ||
      (isBefore(start, now) && isAfter(end, now) && s.status === "scheduled")
    );
  });

  return (
    <div className="space-y-8">
      {activeNow ? (
        <div
          className="rounded-brand-lg border border-gold bg-gold/10 px-4 py-3"
          role="status"
        >
          <p className="font-body text-sm text-cream">
            <span className="font-semibold text-gold">Active call:</span>{" "}
            {activeNow.title ?? "Video call"} —{" "}
            <Link
              href={`/dashboard/video-calls/${activeNow.id}`}
              className="text-gold underline focus:outline-none focus:ring-2 focus:ring-gold"
            >
              Join lobby
            </Link>
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg text-gold">Upcoming calls</h2>
        <GoldButton label="Schedule new call" href="/dashboard/video-calls/new" size="sm" />
      </div>

      {(upcoming ?? []).length === 0 ? (
        <p className="font-body text-sm text-cream/70">No upcoming video calls.</p>
      ) : (
        <ul className="space-y-2">
          {(upcoming ?? []).map((s) => (
            <li key={s.id as string}>
              <Link
                href={`/dashboard/video-calls/${s.id}`}
                className="block rounded-brand-md border border-gold/20 bg-navy-lift px-4 py-3 transition hover:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <span className="font-display text-sm text-cream">{s.title ?? "Video call"}</span>
                <span className="mt-1 block font-body text-xs text-goldBody">
                  {format(parseISO(s.scheduled_start as string), "PPp")} · {s.session_type}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section>
        <h2 className="font-display text-lg text-gold">Past calls & recordings</h2>
        {(past ?? []).length === 0 ? (
          <p className="mt-2 font-body text-sm text-cream/70">No past calls yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {(past ?? []).map((s) => (
              <li
                key={s.id as string}
                className="flex flex-wrap items-center justify-between gap-2 rounded-brand-md border border-gold/15 bg-navy-deep/50 px-4 py-2"
              >
                <div>
                  <span className="font-body text-sm text-cream">{s.title ?? "Call"}</span>
                  <span className="block font-body text-xs text-goldBody">
                    {format(parseISO(s.scheduled_start as string), "PP")}
                  </span>
                </div>
                {s.recording_url ? (
                  <Link
                    href={`/dashboard/video-calls/${s.id}/recording`}
                    className="font-body text-xs text-gold underline focus:ring-2 focus:ring-gold"
                  >
                    View recording
                  </Link>
                ) : (
                  <span className="font-body text-xs text-cream/50">No recording</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
