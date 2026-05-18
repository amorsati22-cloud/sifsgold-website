const BANNED_TERMS = [
  "spam",
  "scam",
  "free money",
  "click here",
  "nigerian prince",
  // Add slurs / hate speech patterns in production — kept minimal for repo safety
];

const SPAM_PATTERNS = [
  /(.)\1{6,}/i,
  /https?:\/\/\S+/i,
  /\b(buy|sell)\s+now\b/i,
];

export type FilterResult = {
  allowed: boolean;
  reason?: string;
};

export function filterComment(content: string): FilterResult {
  const normalized = content.trim().toLowerCase();
  if (!normalized) return { allowed: false, reason: "Empty comment" };
  if (normalized.length > 500) return { allowed: false, reason: "Comment too long" };

  for (const term of BANNED_TERMS) {
    if (normalized.includes(term)) {
      return { allowed: false, reason: "Comment contains blocked language" };
    }
  }

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      return { allowed: false, reason: "Comment looks like spam" };
    }
  }

  return { allowed: true };
}
