import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LoyaltyTransactionsPage() {
  const { user } = await requireLoyaltyOwner();
  const admin = createAdminClient();
  const { data: program } = admin ? await admin.from("loyalty_programs").select("id").eq("owner_id", user.id).maybeSingle() : { data: null };
  const { data: memberRows } = program && admin ? await admin.from("loyalty_memberships").select("id").eq("program_id", program.id) : { data: [] };
  const memberIds = (memberRows ?? []).map((m) => m.id as string);
  const { data: txs } = memberIds.length && admin ? await admin.from("loyalty_transactions").select("*").in("membership_id", memberIds).order("created_at", { ascending: false }).limit(50) : { data: [] };
  return (
    <ul className="space-y-1 text-sm text-cream">
      {(txs ?? []).map((t) => (
        <li key={t.id as string}>{t.transaction_type as string}: {t.points_change as number} - {t.description as string}</li>
      ))}
    </ul>
  );
}
