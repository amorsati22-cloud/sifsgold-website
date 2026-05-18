import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { FTC_MAX_STRIKES } from "@/lib/brand-deals/constants";

const FTC_PATTERNS = [
  /#partner\b/i,
  /#ad\b/i,
  /paid\s+partnership/i,
  /sponsored/i,
  /#sponsored/i,
  /ftc/i,
  /16\s*cfr\s*255/i,
];

export type FtcVerificationResult = {
  compliant: boolean;
  score: number;
  matched: string[];
  suggestions: string[];
};

export async function verifyFtcDisclosureOnUrl(
  postUrl: string,
  requiredDisclosureText?: string,
): Promise<FtcVerificationResult> {
  const suggestions: string[] = [];
  const matched: string[] = [];

  let pageText = "";
  try {
    const res = await fetch(postUrl, {
      headers: { "User-Agent": "SifsGold-FTC-Checker/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    pageText = await res.text();
  } catch {
    return {
      compliant: false,
      score: 0,
      matched: [],
      suggestions: [
        "Could not fetch the post URL. Ensure the post is public and includes #partner or #ad in the caption.",
      ],
    };
  }

  for (const pattern of FTC_PATTERNS) {
    if (pattern.test(pageText)) matched.push(pattern.source);
  }

  if (requiredDisclosureText) {
    const keyPhrase = requiredDisclosureText.split("\n")[0]?.slice(0, 40);
    if (keyPhrase && pageText.toLowerCase().includes(keyPhrase.toLowerCase().slice(0, 20))) {
      matched.push("custom_template");
    }
  }

  const score = Math.min(100, matched.length * 25);
  const compliant = matched.length >= 1;

  if (!compliant) {
    suggestions.push('Add "#partner" or "#ad" prominently in the caption.');
    suggestions.push('Include "Paid partnership with [Brand]" per FTC 16 CFR Part 255.');
    if (requiredDisclosureText) {
      suggestions.push("Use the campaign disclosure template provided in your contract.");
    }
  }

  return { compliant, score, matched, suggestions };
}

export async function recordFtcStrikeIfNeeded(
  admin: SupabaseClient,
  advocateId: string,
  deliverableId: string,
  reason: string,
): Promise<{ strikeCount: number; suspended: boolean }> {
  await admin.from("advocate_ftc_strikes").insert({
    advocate_id: advocateId,
    deliverable_id: deliverableId,
    reason,
  });

  const { count } = await admin
    .from("advocate_ftc_strikes")
    .select("id", { count: "exact", head: true })
    .eq("advocate_id", advocateId);

  const strikeCount = count ?? 0;
  const suspended = strikeCount >= FTC_MAX_STRIKES;

  if (suspended) {
    await admin
      .from("advocate_profiles")
      .update({ marketplace_suspended: true, ftc_strike_count: strikeCount })
      .eq("id", advocateId);
  } else {
    await admin.from("advocate_profiles").update({ ftc_strike_count: strikeCount }).eq("id", advocateId);
  }

  return { strikeCount, suspended };
}
