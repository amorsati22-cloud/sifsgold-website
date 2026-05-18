"use client";

import nacl from "tweetnacl";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";

function utf8ToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function bytesToUtf8(value: Uint8Array): string {
  return new TextDecoder().decode(value);
}

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
};

import { deriveDmThreadKey, deriveThreadKeyForType } from "@/lib/messaging/group-key-derivation";

/** @deprecated Use deriveThreadKeyForType with thread metadata */
export function deriveThreadKey(threadId: string, participantIds: string[]): Uint8Array {
  return deriveDmThreadKey(threadId, participantIds);
}

export { deriveThreadKeyForType, deriveGroupThreadKey, deriveDmThreadKey } from "@/lib/messaging/group-key-derivation";

export function encryptMessage(plaintext: string, threadKey: Uint8Array): EncryptedPayload {
  const iv = nacl.randomBytes(nacl.secretbox.nonceLength);
  const ciphertext = nacl.secretbox(utf8ToBytes(plaintext), iv, threadKey);
  return {
    ciphertext: encodeBase64(ciphertext),
    iv: encodeBase64(iv),
  };
}

export function decryptMessage(ciphertextB64: string, ivB64: string, threadKey: Uint8Array): string | null {
  try {
    const opened = nacl.secretbox.open(decodeBase64(ciphertextB64), decodeBase64(ivB64), threadKey);
    if (!opened) return null;
    return bytesToUtf8(opened);
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
