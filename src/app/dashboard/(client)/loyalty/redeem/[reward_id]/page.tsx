import { RedeemClient } from "./RedeemClient";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

type Props = { params: { reward_id: string } };

export default async function RedeemRewardPage({ params }: Props) {
  const { supabase } = await requireClientDashboardUser();
  const { data: reward } = await supabase
    .from("loyalty_rewards")
    .select("id, name, cost_points, program_id")
    .eq("id", params.reward_id)
    .maybeSingle();
  return <RedeemClient reward={reward} />;
}
