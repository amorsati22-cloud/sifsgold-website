import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email/resend-client";
import { StateBoardNotifyConfirmation } from "@/lib/email/templates/StateBoardNotifyConfirmation";
import { SLUG_TO_STATE_CODE } from "@/lib/state-board/constants";
import { createClient } from "@/lib/supabase/server";
import { STATE_BOARD_STUBS } from "@/data/states";
import type { ProgramType } from "@/types/state-board";

const bodySchema = z.object({
  state: z.string().min(2).max(2),
  program: z.enum(["cosmetology", "barbering", "esthetics", "nail_tech"]),
  email: z.string().email(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const stateSlug = parsed.data.state.toLowerCase();
  const stub = STATE_BOARD_STUBS[stateSlug as keyof typeof STATE_BOARD_STUBS];
  const stateName = stub?.displayName ?? parsed.data.state.toUpperCase();
  const stateCode = SLUG_TO_STATE_CODE[stateSlug] ?? parsed.data.state.toUpperCase();

  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const row = {
      user_id: user?.id ?? null,
      state: stateCode,
      program_type: parsed.data.program,
      notification_email: parsed.data.email,
    };
    const { error } = user
      ? await supabase.from("state_board_subscriptions").upsert(row, {
          onConflict: "user_id,state,program_type",
        })
      : await supabase.from("state_board_subscriptions").insert(row);

    if (error) {
      return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
    }
  }

  try {
    await sendEmail({
      to: parsed.data.email,
      subject: `${stateName} ${parsed.data.program} prep — notification confirmed`,
      react: StateBoardNotifyConfirmation({
        stateName,
        program: parsed.data.program as ProgramType,
      }),
    });
  } catch (e) {
    console.error("[state-board/notify-me] email failed", e);
    return NextResponse.json(
      { error: "Saved, but confirmation email could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
