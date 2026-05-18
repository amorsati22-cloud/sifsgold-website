import { NextResponse } from "next/server";
import {
  EMAIL_TEMPLATE_TYPES,
  type EmailTemplatePayload,
  type EmailTemplateType,
  sendTemplateEmail,
} from "@/lib/email/send-template";
import { verifySignature, verifyTriggerToken } from "@/lib/email/signing";

export const runtime = "nodejs";

type SendBody = {
  type: EmailTemplateType;
  to: string;
  data?: EmailTemplatePayload;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  let body: SendBody;

  try {
    body = JSON.parse(rawBody) as SendBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const signature = request.headers.get("x-email-signature");
  const triggerToken = request.headers.get("x-email-trigger-token");

  const authorized =
    verifySignature(rawBody, signature) || verifyTriggerToken(triggerToken);

  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!body.type || !EMAIL_TEMPLATE_TYPES.includes(body.type)) {
    return NextResponse.json({ ok: false, error: "Invalid template type" }, { status: 400 });
  }

  if (!body.to?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing recipient" }, { status: 400 });
  }

  try {
    const outcome = await sendTemplateEmail(body.type, body.to, body.data ?? {});

    if (process.env.NODE_ENV === "development") {
      console.info("[api/email/send]", {
        type: body.type,
        to: body.to,
        skipped: outcome.skipped,
      });
    }

    return NextResponse.json({
      ok: true,
      skipped: outcome.skipped,
      reason: outcome.skipped ? outcome.reason : undefined,
      id: outcome.skipped ? undefined : outcome.result.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Send failed";
    console.error("[api/email/send]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
