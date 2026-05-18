import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getTierForLifetimePoints, parseTiers } from "@/lib/loyalty/tier-calculator";
import { generateReferralCode, generateRedemptionCode } from "@/lib/loyalty/referral-engine";

type EarnParams = {
  membershipId: string;
  points: number;
  transactionType?: "earn" | "bonus" | "adjust";
  source?: string;
  sourceId?: string;
  description?: string;
};

export async function awardPoints(admin: SupabaseClient, params: EarnParams) {
  if (params.points <= 0) return { ok: false as const, error: "Points must be positive" };

  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("*, program:loyalty_programs(tiers)")
    .eq("id", params.membershipId)
    .single();

  if (!membership) return { ok: false as const, error: "Membership not found" };

  const newBalance = (membership.points_balance as number) + params.points;
  const lifetime = (membership.lifetime_points_earned as number) + params.points;
  const tiers = parseTiers((membership.program as { tiers: unknown })?.tiers);
  const { current, nextThreshold } = getTierForLifetimePoints(lifetime, tiers);

  await admin
    .from("loyalty_memberships")
    .update({
      points_balance: newBalance,
      lifetime_points_earned: lifetime,
      current_tier: current.name,
      next_tier_threshold: nextThreshold,
      last_activity: new Date().toISOString(),
    })
    .eq("id", params.membershipId);

  const { data: tx } = await admin
    .from("loyalty_transactions")
    .insert({
      membership_id: params.membershipId,
      transaction_type: params.transactionType ?? "earn",
      points_change: params.points,
      source: params.source ?? null,
      source_id: params.sourceId ?? null,
      description: params.description ?? null,
      balance_after: newBalance,
    })
    .select("id")
    .single();

  return { ok: true as const, balance: newBalance, tier: current.name, transactionId: tx?.id };
}

export async function getOrCreateMembership(
  admin: SupabaseClient,
  programId: string,
  memberId: string,
  referredByCode?: string | null,
) {
  const { data: existing } = await admin
    .from("loyalty_memberships")
    .select("id")
    .eq("program_id", programId)
    .eq("member_id", memberId)
    .maybeSingle();

  if (existing) return existing.id as string;

  let referredByMemberId: string | null = null;
  if (referredByCode) {
    const { data: referrer } = await admin
      .from("loyalty_memberships")
      .select("id")
      .eq("referral_code", referredByCode.toUpperCase())
      .maybeSingle();
    referredByMemberId = referrer?.id ?? null;
  }

  const { data: created, error } = await admin
    .from("loyalty_memberships")
    .insert({
      program_id: programId,
      member_id: memberId,
      referral_code: generateReferralCode(),
      referred_by_member_id: referredByMemberId,
    })
    .select("id")
    .single();

  if (error || !created) return null;

  const { data: program } = await admin
    .from("loyalty_programs")
    .select("enrollment_bonus")
    .eq("id", programId)
    .single();

  if (program?.enrollment_bonus && Number(program.enrollment_bonus) > 0) {
    await awardPoints(admin, {
      membershipId: created.id as string,
      points: Number(program.enrollment_bonus),
      transactionType: "bonus",
      source: "enrollment",
      description: "Enrollment welcome bonus",
    });
  }

  return created.id as string;
}

export async function redeemReward(
  admin: SupabaseClient,
  params: { membershipId: string; rewardId: string; memberId: string },
) {
  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("points_balance, member_id, program_id")
    .eq("id", params.membershipId)
    .single();

  const { data: reward } = await admin
    .from("loyalty_rewards")
    .select("*")
    .eq("id", params.rewardId)
    .eq("active", true)
    .single();

  if (!membership || !reward) return { ok: false as const, error: "Not found" };
  if (membership.member_id !== params.memberId) {
    return { ok: false as const, error: "Forbidden" };
  }
  if (reward.program_id !== membership.program_id) {
    return { ok: false as const, error: "Invalid reward" };
  }

  const cost = reward.cost_points as number;
  if ((membership.points_balance as number) < cost) {
    return { ok: false as const, error: "Insufficient points" };
  }

  if (
    reward.max_redemptions_total != null &&
    (reward.redemptions_count as number) >= (reward.max_redemptions_total as number)
  ) {
    return { ok: false as const, error: "Reward no longer available" };
  }

  const code = generateRedemptionCode();
  const newBalance = (membership.points_balance as number) - cost;

  await admin
    .from("loyalty_memberships")
    .update({
      points_balance: newBalance,
      last_activity: new Date().toISOString(),
    })
    .eq("id", params.membershipId);

  await admin.from("loyalty_transactions").insert({
    membership_id: params.membershipId,
    transaction_type: "redeem",
    points_change: -cost,
    source: "redemption",
    source_id: params.rewardId,
    description: `Redeemed: ${reward.name}`,
    balance_after: newBalance,
  });

  const { data: redemption } = await admin
    .from("loyalty_redemptions")
    .insert({
      membership_id: params.membershipId,
      reward_id: params.rewardId,
      redemption_code: code,
      points_used: cost,
      status: "redeemed",
    })
    .select("*")
    .single();

  await admin
    .from("loyalty_rewards")
    .update({ redemptions_count: (reward.redemptions_count as number) + 1 })
    .eq("id", params.rewardId);

  return { ok: true as const, redemption, redemption_code: code, balance: newBalance };
}

export async function adjustPoints(
  admin: SupabaseClient,
  params: { membershipId: string; pointsChange: number; description: string },
) {
  if (params.pointsChange === 0) return { ok: false as const, error: "No change" };

  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("points_balance, lifetime_points_earned, program:loyalty_programs(tiers)")
    .eq("id", params.membershipId)
    .single();

  if (!membership) return { ok: false as const, error: "Not found" };

  const newBalance = Math.max(0, (membership.points_balance as number) + params.pointsChange);
  const lifetime =
    params.pointsChange > 0
      ? (membership.lifetime_points_earned as number) + params.pointsChange
      : (membership.lifetime_points_earned as number);

  const tiers = parseTiers((membership.program as { tiers: unknown })?.tiers);
  const { current, nextThreshold } = getTierForLifetimePoints(lifetime, tiers);

  await admin
    .from("loyalty_memberships")
    .update({
      points_balance: newBalance,
      lifetime_points_earned: lifetime,
      current_tier: current.name,
      next_tier_threshold: nextThreshold,
      last_activity: new Date().toISOString(),
    })
    .eq("id", params.membershipId);

  await admin.from("loyalty_transactions").insert({
    membership_id: params.membershipId,
    transaction_type: "adjust",
    points_change: params.pointsChange,
    source: "manual",
    description: params.description,
    balance_after: newBalance,
  });

  return { ok: true as const, balance: newBalance };
}
