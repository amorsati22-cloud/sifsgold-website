import { NextResponse } from "next/server";
import { getMessagingContacts } from "@/lib/messaging/contacts";
import { requireMessagingUser } from "@/lib/messaging/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await session.supabase
    .from("profiles")
    .select("user_type")
    .eq("id", session.user.id)
    .maybeSingle();

  const contacts = await getMessagingContacts(
    session.user.id,
    (profile?.user_type as string) ?? null,
  );

  return NextResponse.json({ contacts });
}
