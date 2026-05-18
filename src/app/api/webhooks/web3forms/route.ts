import { NextResponse } from "next/server";
import { resolveTemplateFromSource, sendTemplateEmail } from "@/lib/email/send-template";

export const runtime = "nodejs";

type Web3FormsWebhookPayload = {
  email?: string;
  source?: string;
  name?: string;
  full_name?: string;
  reason?: string;
  subject?: string;
  secret?: string;
  data?: Record<string, string>;
};

function extractEmail(payload: Web3FormsWebhookPayload): string | null {
  const email =
    payload.email ??
    payload.data?.email ??
    (typeof payload.data === "object" ? Object.values(payload.data).find((v) => v.includes("@")) : undefined);
  return email?.trim().toLowerCase() ?? null;
}

function verifyWebhook(request: Request, payload: Web3FormsWebhookPayload): boolean {
  const secret = process.env.WEB3FORMS_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }

  const headerSecret =
    request.headers.get("x-web3forms-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerSecret && headerSecret === secret) return true;
  if (payload.secret === secret) return true;

  return false;
}

export async function POST(request: Request) {
  let payload: Web3FormsWebhookPayload;

  try {
    payload = (await request.json()) as Web3FormsWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyWebhook(request, payload)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const email = extractEmail(payload);
  const source = payload.source ?? payload.data?.source ?? payload.subject ?? "";

  if (!email) {
    return NextResponse.json({ ok: true, skipped: true, reason: "no_email" });
  }

  const templateType = resolveTemplateFromSource(source);

  if (!templateType) {
    return NextResponse.json({ ok: true, skipped: true, reason: "unknown_template" });
  }

  try {
    const outcome = await sendTemplateEmail(templateType, email, {
      name: payload.name ?? payload.full_name,
      reason: payload.reason,
      source,
    });

    console.info("[webhooks/web3forms]", {
      email,
      source,
      templateType,
      skipped: outcome.skipped,
    });

    return NextResponse.json({
      ok: true,
      template: templateType,
      skipped: outcome.skipped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Send failed";
    console.error("[webhooks/web3forms]", message);
    // Return 200 so Web3Forms does not retry endlessly when Resend is not configured yet
    return NextResponse.json({ ok: true, sent: false, error: message });
  }
}
