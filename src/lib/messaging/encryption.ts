"use client";

import nacl from "tweetnacl";
import { decodeBase64, decodeUTF8, encodeBase64, encodeUTF8 } from "tweetnacl-util";

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
};

/** Deterministic 32-byte key from thread + sorted participant IDs (shared secret protocol). */
export function deriveThreadKey(threadId: string, participantIds: string[]): Uint8Array {
  const material = `${threadId}:${[...participantIds].sort().join(":")}`;
  return nacl.hash(decodeUTF8(material)).slice(0, nacl.secretbox.keyLength);
}

export function encryptMessage(plaintext: string, threadKey: Uint8Array): EncryptedPayload {
  const iv = nacl.randomBytes(nacl.secretbox.nonceLength);
  const ciphertext = nacl.secretbox(encodeUTF8(plaintext), iv, threadKey);
  return {
    ciphertext: encodeBase64(ciphertext),
    iv: encodeBase64(iv),
  };
}

export function decryptMessage(ciphertextB64: string, ivB64: string, threadKey: Uint8Array): string | null {
  try {
    const opened = nacl.secretbox.open(decodeBase64(ciphertextB64), decodeBase64(ivB64), threadKey);
    if (!opened) return null;
    return encodeUTF8(opened);
  } catch {
    return null;
  }
}

export function encryptJson(value: unknown, threadKey: Uint8Array): EncryptedPayload {
  return encryptMessage(JSON.stringify(value), threadKey);
}

export function decryptJson<T>(ciphertextB64: string, ivB64: string, threadKey: Uint8Array): T | null {
  const raw = decryptMessage(ciphertextB64, ivB64, threadKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function previewPlaintext(plaintext: string, max = 80): string {
  const oneLine = plaintext.replace(/\s+/g, " ").trim();
  return oneLine.length <= max ? oneLine : `${oneLine.slice(0, max - 1)}…`;
}
