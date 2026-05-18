import "server-only";

import { cookies } from "next/headers";
import { REAUTH_COOKIE } from "@/lib/health-hub/constants";

export async function getReauthTimestamp(): Promise<number | null> {
  const store = await cookies();
  const raw = store.get(REAUTH_COOKIE)?.value;
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isFinite(ts) ? ts : null;
}

export async function isReauthValid(reauthenticateAfterMinutes: number): Promise<boolean> {
  const ts = await getReauthTimestamp();
  if (ts == null) return false;
  const elapsedMs = Date.now() - ts;
  return elapsedMs < reauthenticateAfterMinutes * 60 * 1000;
}

export async function setReauthCookie(): Promise<void> {
  const store = await cookies();
  store.set(REAUTH_COOKIE, String(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/dashboard/health-hub",
    maxAge: 60 * 60,
  });
}

export async function clearReauthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(REAUTH_COOKIE);
}
