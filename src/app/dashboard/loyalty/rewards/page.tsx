import { RewardsClient } from "./RewardsClient";
import { requireLoyaltyOwner } from "@/lib/loyalty/require-owner";

export default async function LoyaltyRewardsPage() {
  await requireLoyaltyOwner();
  return <RewardsClient />;
}
