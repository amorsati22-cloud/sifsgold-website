import { differenceInHours } from "date-fns";

export type CancellationPolicyId =
  | "24h_full_refund"
  | "24h_50_refund"
  | "48h_full_refund"
  | "non_refundable"
  | "deposit_forfeited"
  | "custom";

export type CancellationEligibility = {
  canCancel: boolean;
  refundPercent: number;
  minHoursBefore: number;
  message: string;
};

const POLICY_CONFIG: Record<
  string,
  { minHours: number; refundPercent: number; canCancel: boolean }
> = {
  "24h_full_refund": { minHours: 24, refundPercent: 100, canCancel: true },
  "24h_50_refund": { minHours: 24, refundPercent: 50, canCancel: true },
  "48h_full_refund": { minHours: 48, refundPercent: 100, canCancel: true },
  non_refundable: { minHours: 0, refundPercent: 0, canCancel: false },
  deposit_forfeited: { minHours: 24, refundPercent: 0, canCancel: true },
  custom: { minHours: 24, refundPercent: 0, canCancel: true },
};

export function evaluateCancellation(
  policyId: string | null | undefined,
  scheduledStartIso: string,
  now: Date = new Date(),
): CancellationEligibility {
  const policy = POLICY_CONFIG[policyId ?? "24h_full_refund"] ?? POLICY_CONFIG["24h_full_refund"];
  const hoursUntil = differenceInHours(new Date(scheduledStartIso), now);

  if (!policy.canCancel) {
    return {
      canCancel: false,
      refundPercent: 0,
      minHoursBefore: policy.minHours,
      message: "This appointment is non-refundable per the service policy.",
    };
  }

  if (hoursUntil < policy.minHours) {
    return {
      canCancel: false,
      refundPercent: 0,
      minHoursBefore: policy.minHours,
      message: `Cancellation must be at least ${policy.minHours} hours before your appointment.`,
    };
  }

  return {
    canCancel: true,
    refundPercent: policy.refundPercent,
    minHoursBefore: policy.minHours,
    message:
      policy.refundPercent === 100
        ? "You are eligible for a full refund."
        : policy.refundPercent === 50
          ? "You are eligible for a 50% refund."
          : "Cancellation accepted. Deposit is non-refundable.",
  };
}

export function refundAmount(
  depositPaid: boolean,
  depositAmount: number,
  refundPercent: number,
): number {
  if (!depositPaid || depositAmount <= 0) return 0;
  return Math.round(depositAmount * (refundPercent / 100) * 100) / 100;
}
