/**
 * Pure calculator functions for Sif's Gold Tools.
 * All outputs are estimates — verify against product labels, boards, and CPAs.
 */

export type TipSplitMember = { name: string; sharePercent: number };

/** Service total × tip %, split across named team shares (must sum to 100). */
export function calculateTipSplit(input: {
  serviceTotal: number;
  tipPercent: number;
  members: TipSplitMember[];
}): {
  tipAmount: number;
  totalWithTip: number;
  perPerson: { name: string; tipShare: number; totalTakeHome: number }[];
} {
  const service = Math.max(0, input.serviceTotal);
  const tipAmount = (service * Math.max(0, input.tipPercent)) / 100;
  const totalWithTip = service + tipAmount;
  const members =
    input.members.length > 0 ? input.members : [{ name: "You", sharePercent: 100 }];
  const shareSum = members.reduce((s, m) => s + Math.max(0, m.sharePercent), 0) || 100;
  const perPerson = members.map((m) => {
    const weight = Math.max(0, m.sharePercent) / shareSum;
    const tipShare = tipAmount * weight;
    const serviceShare = service * weight;
    return {
      name: m.name || "Team member",
      tipShare,
      totalTakeHome: serviceShare + tipShare,
    };
  });
  return { tipAmount, totalWithTip, perPerson };
}

const DEVELOPER_PROCESSING: Record<10 | 20 | 30 | 40, { ratio: string; minutes: number }> = {
  10: { ratio: "1:1 color to 10 vol developer", minutes: 20 },
  20: { ratio: "1:1 or 1:1.5 color to 20 vol developer", minutes: 35 },
  30: { ratio: "1:1.5 or 1:2 color to 30 vol developer", minutes: 45 },
  40: { ratio: "1:2 color to 40 vol developer (high lift)", minutes: 50 },
};

/** Heuristic color mix guidance — always follow manufacturer SDS. */
export function calculateColorFormula(input: {
  developerVolume: 10 | 20 | 30 | 40;
  brand: string;
  baseColor: string;
  targetColor: string;
}): {
  mixingRatio: string;
  processingMinutes: number;
  notes: string;
} {
  const dev = DEVELOPER_PROCESSING[input.developerVolume];
  const liftNote =
    input.developerVolume >= 30
      ? "Higher developer supports more lift — strand test required."
      : "Lower developer for deposit or tone-on-tone.";
  return {
    mixingRatio: dev.ratio,
    processingMinutes: dev.minutes,
    notes: `${input.brand || "Brand"}: base ${input.baseColor || "—"} → target ${input.targetColor || "—"}. ${liftNote} Adjust for grey coverage per manufacturer chart.`,
  };
}

/** C1×V1 = C2×V2 style dilution (percent strengths). */
export function calculateDilution(
  desiredStrengthPercent: number,
  currentConcentrationPercent: number,
): {
  productParts: number;
  diluentParts: number;
  label: string;
  valid: boolean;
} {
  const desired = Math.max(0.01, desiredStrengthPercent);
  const current = Math.max(0.01, currentConcentrationPercent);
  if (desired >= current) {
    return {
      productParts: 1,
      diluentParts: 0,
      label: "Cannot dilute to a higher strength — use full strength product.",
      valid: false,
    };
  }
  const productParts = desired;
  const diluentParts = current - desired;
  const gcd = (a: number, b: number): number => (b < 0.01 ? a : gcd(b, a % b));
  const g = gcd(productParts, diluentParts) || 1;
  const p = Math.round((productParts / g) * 10) / 10;
  const d = Math.round((diluentParts / g) * 10) / 10;
  return {
    productParts: p,
    diluentParts: d,
    label: `Mix ${p} parts product + ${d} parts diluent → ~${desired}% strength from ${current}% stock`,
    valid: true,
  };
}

export function calculateAppointmentRoi(input: {
  servicePrice: number;
  productCost: number;
  minutes: number;
  overheadPercent: number;
}): {
  overheadAmount: number;
  netProfit: number;
  profitPerHour: number;
} {
  const price = Math.max(0, input.servicePrice);
  const product = Math.max(0, input.productCost);
  const hours = Math.max(input.minutes / 60, 1 / 60);
  const overhead = (price * Math.max(0, input.overheadPercent)) / 100;
  const netProfit = price - product - overhead;
  return {
    overheadAmount: overhead,
    netProfit,
    profitPerHour: netProfit / hours,
  };
}

export type ServiceRoiRow = {
  name: string;
  servicePrice: number;
  productCost: number;
  minutes: number;
  overheadPercent: number;
};

export function calculateBulkAppointmentRoi(
  services: ServiceRoiRow[],
): (ServiceRoiRow & ReturnType<typeof calculateAppointmentRoi>)[] {
  return services.map((s) => ({
    ...s,
    ...calculateAppointmentRoi(s),
  }));
}

/** Compare monthly booth rent vs commission % on gross revenue. */
export function calculateBoothRentBreakeven(input: {
  monthlyRent: number;
  commissionPercent: number;
  monthlyGrossRevenue: number;
}): {
  commissionCost: number;
  rentCost: number;
  betterModel: "rent" | "commission" | "tie";
  breakevenRevenue: number;
  savingsAtCurrent: number;
} {
  const gross = Math.max(0, input.monthlyGrossRevenue);
  const rent = Math.max(0, input.monthlyRent);
  const pct = Math.min(100, Math.max(0, input.commissionPercent));
  const commissionCost = (gross * pct) / 100;
  const diff = commissionCost - rent;
  const breakevenRevenue = pct > 0 ? (rent * 100) / pct : 0;
  let betterModel: "rent" | "commission" | "tie" = "tie";
  if (Math.abs(diff) < 1) betterModel = "tie";
  else if (commissionCost < rent) betterModel = "commission";
  else betterModel = "rent";
  return {
    commissionCost,
    rentCost: rent,
    betterModel,
    breakevenRevenue,
    savingsAtCurrent: Math.abs(diff),
  };
}

export type CityTier = "tier1" | "tier2" | "tier3";

const TIER_MULTIPLIER: Record<CityTier, number> = {
  tier1: 1.22,
  tier2: 1.0,
  tier3: 0.88,
};

const BLS_HAIR_MEDIAN_2023 = 35240;

/** Market pricing heuristic — BLS OEWS baseline + experience + tier. Not a guarantee of earnings. */
export function calculatePricingStrategy(input: {
  yearsExperience: number;
  cityTier: CityTier;
  specialty: string;
  category: "hair" | "skin" | "nails" | "lashes" | "barber" | "massage";
}): {
  marketLow: number;
  marketHigh: number;
  recommendedStarting: number;
  hourlyEquivalent: number;
  citation: string;
} {
  const years = Math.max(0, Math.min(40, input.yearsExperience));
  const expMult = 1 + years * 0.035;
  const specialtyMult =
    input.specialty.toLowerCase().includes("color") ||
    input.specialty.toLowerCase().includes("extension")
      ? 1.12
      : 1;
  const categoryMult: Record<string, number> = {
    hair: 1,
    barber: 0.95,
    skin: 1.05,
    nails: 0.9,
    lashes: 1.08,
    massage: 1.02,
  };
  const base = BLS_HAIR_MEDIAN_2023 * TIER_MULTIPLIER[input.cityTier];
  const mid = base * expMult * specialtyMult * (categoryMult[input.category] ?? 1);
  const marketLow = Math.round(mid * 0.82);
  const marketHigh = Math.round(mid * 1.28);
  const recommendedStarting = Math.round(mid * 0.95);
  const hourlyEquivalent = Math.round(recommendedStarting / 1800);
  return {
    marketLow,
    marketHigh,
    recommendedStarting,
    hourlyEquivalent,
    citation:
      "Baseline from U.S. BLS OEWS 2023 hairdressers/hairstylists/cosmetologists; adjusted by experience, metro tier, and specialty — verify with local market surveys.",
  };
}

export type TimedService = { name: string; minutes: number };

export function calculateAppointmentTiming(
  services: TimedService[],
  bufferPercent: number,
): {
  serviceMinutes: number;
  bufferMinutes: number;
  totalMinutes: number;
  blockLabel: string;
} {
  const serviceMinutes = services.reduce((s, x) => s + Math.max(0, x.minutes), 0);
  const bufferMinutes = Math.ceil((serviceMinutes * Math.max(0, bufferPercent)) / 100);
  const totalMinutes = serviceMinutes + bufferMinutes;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const blockLabel = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return { serviceMinutes, bufferMinutes, totalMinutes, blockLabel };
}

export function calculateInventoryCost(input: {
  bottleSizeMl: number;
  bottleCost: number;
  usagePerServiceMl: number;
  targetMarkupPercent: number;
}): {
  costPerService: number;
  servicesPerBottle: number;
  suggestedRetail: number;
  suggestedServiceCharge: number;
} {
  const size = Math.max(0.1, input.bottleSizeMl);
  const cost = Math.max(0, input.bottleCost);
  const usage = Math.max(0.1, input.usagePerServiceMl);
  const servicesPerBottle = size / usage;
  const costPerService = cost / servicesPerBottle;
  const markup = 1 + Math.max(0, input.targetMarkupPercent) / 100;
  const suggestedServiceCharge = costPerService * markup;
  const suggestedRetail = cost * markup;
  return {
    costPerService,
    servicesPerBottle,
    suggestedRetail,
    suggestedServiceCharge,
  };
}

export function calculateStateBoardCountdown(input: {
  examDateIso: string;
  studyHoursRemaining: number;
}): {
  daysRemaining: number;
  hoursPerDay: number;
  pastDue: boolean;
} {
  const exam = new Date(input.examDateIso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  const ms = exam.getTime() - now.getTime();
  const daysRemaining = Math.ceil(ms / (1000 * 60 * 60 * 24));
  const pastDue = daysRemaining < 0;
  const days = Math.max(1, daysRemaining);
  const hoursPerDay = Math.ceil(Math.max(0, input.studyHoursRemaining) / days);
  return { daysRemaining, hoursPerDay, pastDue };
}

export function calculateLicenseRenewal(input: {
  expirationDateIso: string;
  ceHoursRequired: number;
  ceHoursCompleted: number;
  reminderDays: number;
}): {
  daysUntilExpiration: number;
  ceHoursRemaining: number;
  shouldRemind: boolean;
  expired: boolean;
} {
  const exp = new Date(input.expirationDateIso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  const daysUntilExpiration = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const ceHoursRemaining = Math.max(0, input.ceHoursRequired - input.ceHoursCompleted);
  const expired = daysUntilExpiration < 0;
  const shouldRemind =
    !expired && daysUntilExpiration <= input.reminderDays && daysUntilExpiration >= 0;
  return { daysUntilExpiration, ceHoursRemaining, shouldRemind, expired };
}

/** Simplified SE tax estimate — federal only, illustrative. */
export function calculateBusinessTax(input: {
  grossRevenue: number;
  businessExpenses: number;
  seTaxRate?: number;
  incomeTaxRate?: number;
}): {
  netProfit: number;
  seTax: number;
  incomeTax: number;
  totalEstimated: number;
  quarterlyPayment: number;
} {
  const gross = Math.max(0, input.grossRevenue);
  const expenses = Math.max(0, input.businessExpenses);
  const netProfit = Math.max(0, gross - expenses);
  const seRate = input.seTaxRate ?? 0.153;
  const incomeRate = input.incomeTaxRate ?? 0.22;
  const seTax = netProfit * seRate;
  const incomeTax = netProfit * incomeRate;
  const totalEstimated = seTax + incomeTax;
  return {
    netProfit,
    seTax,
    incomeTax,
    totalEstimated,
    quarterlyPayment: totalEstimated / 4,
  };
}

export type SocialPlatform = "instagram" | "tiktok" | "facebook" | "pinterest";

const PLATFORM_TIMES: Record<SocialPlatform, string[]> = {
  instagram: ["Tue 11:00 AM", "Thu 7:00 PM", "Sat 10:00 AM"],
  tiktok: ["Mon 6:00 PM", "Wed 12:00 PM", "Fri 5:00 PM"],
  facebook: ["Wed 1:00 PM", "Thu 3:00 PM", "Sun 9:00 AM"],
  pinterest: ["Sat 8:00 PM", "Sun 2:00 PM", "Tue 9:00 PM"],
};

export function suggestSocialPostTimes(platform: SocialPlatform): string[] {
  return PLATFORM_TIMES[platform];
}

export function generateSocialCaption(input: {
  serviceType: string;
  tone: "educational" | "behind_the_chair" | "promo";
}): string {
  const service = input.serviceType.trim() || "today's service";
  if (input.tone === "educational") {
    return `✨ Pro tip from the chair: ${service} starts with consultation + realistic maintenance. Questions? Drop them below — happy to help you plan your look. #SifsGold #BehindTheChair`;
  }
  if (input.tone === "promo") {
    return `Limited openings this week for ${service}. Book through my Sif's Gold profile — link in bio. Can't wait to see you in the chair! #SifsGold #BeautyPro`;
  }
  return `Another day, another transformation. ${service} — crafted with care. Save this for inspo & share with someone who needs a refresh. #SifsGold #GoldCollective`;
}

export const DILUTION_PRESETS = [
  { label: "20 vol → 10 vol", desired: 10, current: 20 },
  { label: "30 vol → 20 vol", desired: 20, current: 30 },
  { label: "40 vol → 20 vol", desired: 20, current: 40 },
  { label: "Bleach 8% → 4%", desired: 4, current: 8 },
] as const;
