import Link from "next/link";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export default async function ClientLoyaltyPage() {
  const { supabase, user } = await requireClientDashboardUser();
  const { data: memberships } = await supabase
    .from("loyalty_memberships")
    .select("id, program_id, points_balance, current_tier, next_tier_threshold, referral_code, program:loyalty_programs(name)")
    .eq("member_id", user.id);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-gold">Your rewards</h2>
      {(memberships ?? []).length === 0 ? (
        <p className="text-sm text-cream/70">Book with a pro to join their loyalty program.</p>
      ) : (
        <ul className="space-y-3">
          {(memberships ?? []).map((m) => (
            <li key={m.id as string} className="rounded-brand-lg border border-gold/20 p-4">
              <p className="font-semibold text-cream">{(m.program as { name: string }).name}</p>
              <p className="text-sm text-gold">{m.points_balance as number} points - {m.current_tier as string}</p>
              <Link href={"/dashboard/loyalty/" + m.program_id} className="mt-2 inline-block text-sm text-gold underline">Browse rewards</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
