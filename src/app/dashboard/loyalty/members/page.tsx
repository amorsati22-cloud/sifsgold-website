import { MembersClient } from "./MembersClient";
import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LoyaltyMembersPage() {
  const { user } = await requireLoyaltyOwner();
  const admin = createAdminClient();
  const { data: program } = admin
    ? await admin.from("loyalty_programs").select("id").eq("owner_id", user.id).maybeSingle()
    : { data: null };

  const { data: members } = program && admin
    ? await admin
        .from("loyalty_memberships")
        .select("id, points_balance, current_tier, last_activity, profiles:member_id(full_name, email)")
        .eq("program_id", program.id)
        .order("points_balance", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-gold">Members</h2>
      {!program ? (
        <p className="text-sm text-cream/70">Set up your loyalty program first.</p>
      ) : (
        <MembersClient
          members={(members ?? []).map((m) => ({
            ...m,
            profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles,
          }))}
        />
      )}
    </div>
  );
}
