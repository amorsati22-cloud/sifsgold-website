import { NextResponse } from "next/server";
import {
  EMAIL_TEMPLATE_TYPES,
  type EmailTemplateType,
  sendTemplateEmail,
} from "@/lib/email/send-template";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  let body: { type?: EmailTemplateType; to?: string };
  try {
    body = (await request.json()) as { type?: EmailTemplateType; to?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type;
  const to = body.to?.trim();

  if (!type || !EMAIL_TEMPLATE_TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: "Invalid template type" }, { status: 400 });
  }
  if (!to) {
    return NextResponse.json({ ok: false, error: "Missing to address" }, { status: 400 });
  }

  try {
    const outcome = await sendTemplateEmail(type, to, {
      name: "Test Recipient",
      firstName: "Test",
      reason: "General",
      tier: "Advocate",
    });

    return NextResponse.json({
      ok: true,
      skipped: outcome.skipped,
      id: outcome.skipped ? undefined : outcome.result.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Send failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ templates: EMAIL_TEMPLATE_TYPES });
}
