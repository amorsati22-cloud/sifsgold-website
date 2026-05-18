import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  return process.env.EMAIL_SEND_SECRET ?? "";
}

export function signPayload(payload: string): string {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = signPayload(payload);
  if (!expected) return false;
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyTriggerToken(token: string | null): boolean {
  const serverToken =
    process.env.EMAIL_TRIGGER_TOKEN?.trim() ??
    process.env.NEXT_PUBLIC_EMAIL_TRIGGER_TOKEN?.trim();
  if (!serverToken || !token) return false;
  try {
    const a = Buffer.from(serverToken);
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type EmailTokenPayload = {
  email: string;
  purpose: "unsubscribe" | "preferences" | "view";
  template?: string;
  exp: number;
};

export function createEmailToken(
  email: string,
  purpose: EmailTokenPayload["purpose"],
  template?: string,
  ttlMs = 1000 * 60 * 60 * 24 * 90,
): string {
  const secret = getSecret() || process.env.NEXT_PUBLIC_EMAIL_TRIGGER_TOKEN || "dev-token";
  const payload: EmailTokenPayload = {
    email: email.toLowerCase().trim(),
    purpose,
    template,
    exp: Date.now() + ttlMs,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function parseEmailToken(token: string): EmailTokenPayload | null {
  const secret = getSecret() || process.env.NEXT_PUBLIC_EMAIL_TRIGGER_TOKEN || "dev-token";
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(sig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as EmailTokenPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildUnsubscribeUrl(email: string): string {
  const token = createEmailToken(email, "unsubscribe");
  return `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifsgold.com"}/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function buildPreferencesUrl(email: string): string {
  const token = createEmailToken(email, "preferences");
  return `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifsgold.com"}/email-preferences?token=${encodeURIComponent(token)}`;
}

export function buildViewInBrowserUrl(email: string, template: string): string {
  const token = createEmailToken(email, "view", template);
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifsgold.com";
  return `${base}/api/email/view?template=${encodeURIComponent(template)}&token=${encodeURIComponent(token)}`;
}
