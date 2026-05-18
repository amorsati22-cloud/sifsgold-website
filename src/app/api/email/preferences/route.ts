import { NextResponse } from "next/server";
import { setMarketingOptOut } from "@/lib/email/preferences";
import { parseEmailToken } from "@/lib/email/signing";

export const runtime = "nodejs";

type Body = {
  token: string;
  marketingOptOut: boolean;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = parseEmailToken(body.token);
  if (!payload || payload.purpose !== "preferences") {
    return NextResponse.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
  }

  const record = await setMarketingOptOut(payload.email, body.marketingOptOut);

  return NextResponse.json({
    ok: true,
    email: record.email,
    marketingOptOut: record.marketingOptOut,
  });
}
