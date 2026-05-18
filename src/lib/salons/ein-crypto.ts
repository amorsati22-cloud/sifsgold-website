import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";

function getKey(ownerId: string): Buffer {
  const secret = process.env.SALON_EIN_ENCRYPTION_SECRET ?? "dev-salon-ein-secret-change-me";
  return createHash("sha256").update(`${secret}:${ownerId}`).digest();
}

export function encryptEin(plaintext: string, ownerId: string): { encrypted_ein: string; ein_iv: string } {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, getKey(ownerId), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted_ein: Buffer.concat([enc, tag]).toString("base64"),
    ein_iv: iv.toString("base64"),
  };
}

export function decryptEin(encrypted_ein: string, ein_iv: string, ownerId: string): string | null {
  try {
    const iv = Buffer.from(ein_iv, "base64");
    const buf = Buffer.from(encrypted_ein, "base64");
    const tag = buf.subarray(buf.length - 16);
    const data = buf.subarray(0, buf.length - 16);
    const decipher = createDecipheriv(ALGO, getKey(ownerId), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
