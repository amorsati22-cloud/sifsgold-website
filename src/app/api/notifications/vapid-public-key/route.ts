import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() ?? process.env.VAPID_PUBLIC_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "Web push not configured" }, { status: 503 });
  }
  return NextResponse.json({ publicKey: key });
}
