import Link from "next/link";
import { Suspense } from "react";
import { EnrollClient } from "./EnrollClient";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

type Props = { params: { program_id: string } };

export default async function ClientProgramLoyaltyPage({ params }: Props) {
  const { supabase, user } = await requireClientDashboardUser();
  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("id, name, active")
    .eq("id", params.program_id)
    .maybeSingle();

  const { data: membership } = await supabase
    .from("loyalty_memberships")
    .select("*")
    .eq("program_id", params.program_id)
    .eq("member_id", user.id)
    .maybeSingle();

  const { data: rewards } = await supabase
    .from("loyalty_rewards")
    .select("*")
    .eq("program_id", params.program_id)
    .eq("active", true);

  const { data: history } = membership
    ? await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("membership_id", membership.id)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: [] };

  if (!membership) {
    if (!program?.active) return <p className="text-cream/70">This loyalty program is not available.</p>;
    return (
      <Suspense fallback={<p className="text-cream/70">Loading…</p>}>
        <EnrollClient programId={params.program_id} programName={program.name as string} />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-2xl text-gold">{membership.points_balance as number} points</p>
      <p className="text-sm text-cream/70">Tier: {membership.current_tier as string}</p>
      <p className="text-sm text-cream/70">Referral code: {membership.referral_code as string}</p>
      <h3 className="font-display text-gold">Rewards</h3>
      <ul className="space-y-2">
        {(rewards ?? []).map((r) => (
          <li key={r.id as string} className="flex justify-between rounded border border-gold/15 p-3 text-sm">
            <span>{r.name as string}</span>
            <Link href={"/dashboard/loyalty/redeem/" + r.id} className="text-gold underline">{r.cost_points as number} pts</Link>
          </li>
        ))}
      </ul>
      <h3 className="font-display text-gold">History</h3>
      <ul className="text-sm text-cream/80">{(history ?? []).map((t) => <li key={t.id as string}>{t.description as string} ({t.points_change as number})</li>)}</ul>
    </div>
  );
}
