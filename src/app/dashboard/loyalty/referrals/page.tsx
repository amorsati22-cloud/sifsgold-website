import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LoyaltyReferralsPage() {
  const { user } = await requireLoyaltyOwner();
  const admin = createAdminClient();
  const { data: program } = admin ? await admin.from("loyalty_programs").select("id").eq("owner_id", user.id).maybeSingle() : { data: null };
  const { data: memberships } = program && admin ? await admin.from("loyalty_memberships").select("id").eq("program_id", program.id) : { data: [] };
  const ids = (memberships ?? []).map((m) => m.id as string);
  const { data: refs } = ids.length && admin ? await admin.from("referrals").select("*").in("referrer_membership_id", ids).limit(50) : { data: [] };
  return <ul className="space-y-1 text-sm">{(refs ?? []).map((r) => <li key={r.id as string}>{r.referred_email as string} - {r.status as string}</li>)}</ul>;
}
