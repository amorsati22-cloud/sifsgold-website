import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LoyaltyOverviewPage() {
  const { user } = await requireLoyaltyOwner();
  const admin = createAdminClient();

  const { data: program } = admin
    ? await admin.from("loyalty_programs").select("*").eq("owner_id", user.id).maybeSingle()
    : { data: null };

  if (!program) {
    return (
      <div className="rounded-brand-lg border border-gold/30 p-8 text-center">
        <h2 className="font-display text-xl text-gold">Set up your loyalty program</h2>
        <p className="mt-2 text-sm text-cream/70">Reward clients with points, tiers, and referrals.</p>
        <div className="mt-4"><GoldButton label="Get started" href="/dashboard/loyalty/setup" /></div>
      </div>
    );
  }

  const { count: members } = await admin!
    .from("loyalty_memberships")
    .select("id", { count: "exact", head: true })
    .eq("program_id", program.id);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const { count: redemptions } = await admin!
    .from("loyalty_redemptions")
    .select("id", { count: "exact", head: true })
    .gte("redeemed_at", startOfMonth.toISOString());

  const { data: top } = await admin!
    .from("loyalty_memberships")
    .select("points_balance, lifetime_points_earned, profiles:member_id(full_name)")
    .eq("program_id", program.id)
    .order("lifetime_points_earned", { ascending: false })
    .limit(5);

  const { data: circulating } = await admin!
    .from("loyalty_memberships")
    .select("points_balance")
    .eq("program_id", program.id);

  const totalPoints = (circulating ?? []).reduce((s, m) => s + Number(m.points_balance), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Members" value={String(members ?? 0)} />
        <Stat label="Points circulating" value={totalPoints.toLocaleString()} />
        <Stat label="Redemptions this month" value={String(redemptions ?? 0)} />
      </div>
      <GoldButton label="Create rewards" href="/dashboard/loyalty/rewards" size="sm" />
      <section>
        <h2 className="font-display text-lg text-gold">Top members</h2>
        <ul className="mt-2 space-y-2">
          {(top ?? []).map((m, i) => (
            <li key={i} className="flex justify-between rounded-brand-md border border-gold/15 px-4 py-2 text-sm">
              <span>{(m.profiles as { full_name?: string })?.full_name ?? "Member"}</span>
              <span className="text-gold">{m.lifetime_points_earned as number} lifetime pts</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-lg border border-gold/20 bg-navy-lift p-4">
      <p className="text-xs text-goldBody">{label}</p>
      <p className="font-display text-2xl text-gold">{value}</p>
    </div>
  );
}
