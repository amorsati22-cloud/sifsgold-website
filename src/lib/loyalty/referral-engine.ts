import "server-only";

import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { awardPoints } from "@/lib/loyalty/points-engine";

export function generateReferralCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export function generateRedemptionCode(): string {
  return `SG-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function createReferralInvite(
  admin: SupabaseClient,
  params: {
    referrerMembershipId: string;
    email: string;
    referralCode: string;
  },
) {
  const { data, error } = await admin
    .from("referrals")
    .insert({
      referrer_membership_id: params.referrerMembershipId,
      referred_email: params.email.toLowerCase(),
      referral_code: params.referralCode,
      status: "sent",
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { referral: data };
}

export async function processReferralOnSignup(
  admin: SupabaseClient,
  userId: string,
  email: string,
  referralCode?: string | null,
) {
  if (!referralCode) return;

  const { data: referrerMembership } = await admin
    .from("loyalty_memberships")
    .select("id, program_id, referral_code")
    .eq("referral_code", referralCode.toUpperCase())
    .maybeSingle();

  if (!referrerMembership) return;

  await admin
    .from("referrals")
    .update({ referred_user_id: userId, status: "signed_up" })
    .eq("referral_code", referralCode.toUpperCase())
    .eq("referred_email", email.toLowerCase());

  const { data: existing } = await admin
    .from("loyalty_memberships")
    .select("id")
    .eq("program_id", referrerMembership.program_id)
    .eq("member_id", userId)
    .maybeSingle();

  if (!existing) {
    await admin.from("loyalty_memberships").insert({
      program_id: referrerMembership.program_id,
      member_id: userId,
      referral_code: generateReferralCode(),
      referred_by_member_id: referrerMembership.id,
    });
  }
}

export async function processReferralOnFirstAppointment(
  admin: SupabaseClient,
  appointmentId: string,
  clientId: string,
) {
  const { data: membership } = await admin
    .from("loyalty_memberships")
    .select("id, program_id, referred_by_member_id")
    .eq("member_id", clientId)
    .not("referred_by_member_id", "is", null)
    .maybeSingle();

  if (!membership?.referred_by_member_id) return;

  const { data: referral } = await admin
    .from("referrals")
    .select("*")
    .eq("referrer_membership_id", membership.referred_by_member_id)
    .eq("referred_user_id", clientId)
    .in("status", ["sent", "signed_up"])
    .maybeSingle();

  if (!referral) return;

  const { data: program } = await admin
    .from("loyalty_programs")
    .select("points_per_referral, enrollment_bonus")
    .eq("id", membership.program_id)
    .single();

  const referralPoints = program?.points_per_referral ?? 100;

  await awardPoints(admin, {
    membershipId: membership.referred_by_member_id as string,
    points: referralPoints,
    transactionType: "bonus",
    source: "referral",
    sourceId: appointmentId,
    description: "Referral bonus — friend completed first appointment",
  });

  await awardPoints(admin, {
    membershipId: membership.id as string,
    points: program?.enrollment_bonus ?? 0,
    transactionType: "bonus",
    source: "referral",
    sourceId: appointmentId,
    description: "Welcome bonus — referred signup",
  });

  await admin
    .from("referrals")
    .update({
      status: "rewarded",
      first_appointment_id: appointmentId,
      reward_paid_at: new Date().toISOString(),
      referrer_points_awarded: referralPoints,
    })
    .eq("id", referral.id);
}
