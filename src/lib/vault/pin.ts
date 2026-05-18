"use client";

import argon2 from "argon2-browser";

export function validatePinFormat(pin: string): { ok: boolean; error?: string } {
  if (!/^\d{4,6}$/.test(pin)) {
    return { ok: false, error: "PIN must be 4–6 digits" };
  }
  return { ok: true };
}

export async function hashVaultPin(pin: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const result = await argon2.hash({
    pass: pin,
    salt,
    time: 3,
    mem: 65536,
    hashLen: 32,
    type: argon2.ArgonType.Argon2id,
  });
  return result.encoded;
}

export async function verifyVaultPin(pin: string, encodedHash: string): Promise<boolean> {
  try {
    await argon2.verify({ pass: pin, encoded: encodedHash });
    return true;
  } catch {
    return false;
  }
}
