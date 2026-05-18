export type LoyaltyOwnerType = "pro" | "salon" | "brand";

export type LoyaltyTier = {
  name: string;
  threshold: number;
  perks: string[];
};

export type LoyaltyProgram = {
  id: string;
  owner_id: string;
  owner_type: LoyaltyOwnerType;
  name: string;
  description: string | null;
  points_per_dollar: number;
  points_per_appointment: number;
  points_per_referral: number;
  enrollment_bonus: number;
  birthday_bonus: number;
  tiers: LoyaltyTier[];
  expiration_months: number | null;
  active: boolean;
};

export type LoyaltyMembership = {
  id: string;
  program_id: string;
  member_id: string;
  points_balance: number;
  lifetime_points_earned: number;
  current_tier: string;
  next_tier_threshold: number | null;
  referral_code: string;
};

export const DEFAULT_TIERS: LoyaltyTier[] = [
  { name: "Bronze", threshold: 0, perks: ["5%_discount"] },
  { name: "Silver", threshold: 500, perks: ["10%_discount", "priority_booking"] },
  { name: "Gold", threshold: 1500, perks: ["15%_discount", "birthday_bonus"] },
];
