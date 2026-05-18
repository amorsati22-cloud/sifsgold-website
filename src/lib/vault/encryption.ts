"use client";

const PBKDF2_ITERATIONS = 310_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function deriveVaultKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Stable salt per user stored alongside settings (first 16 bytes of pin_hash salt embedded in vault session). */
export function getOrCreateUserSalt(userId: string): Uint8Array {
  const key = `sifs_vault_salt_${userId}`;
  const existing = localStorage.getItem(key);
  if (existing) return fromBase64(existing);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  localStorage.setItem(key, toBase64(salt.buffer));
  return salt;
}

export async function deriveVaultKeyForUser(pin: string, userId: string): Promise<CryptoKey> {
  const salt = getOrCreateUserSalt(userId);
  return deriveVaultKey(pin, salt);
}

export async function exportVaultKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return toBase64(raw);
}

export async function importVaultKey(b64: string): Promise<CryptoKey> {
  const raw = fromBase64(b64);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function encryptBytes(key: CryptoKey, data: ArrayBuffer): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { ciphertext: toBase64(encrypted), iv: toBase64(iv.buffer) };
}

export async function decryptBytes(key: CryptoKey, ciphertextB64: string, ivB64: string): Promise<ArrayBuffer> {
  const iv = fromBase64(ivB64);
  const ciphertext = fromBase64(ciphertextB64);
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
}

export async function encryptFile(key: CryptoKey, file: Blob): Promise<Blob> {
  const data = await file.arrayBuffer();
  const { ciphertext, iv } = await encryptBytes(key, data);
  const payload = JSON.stringify({ v: 1, iv, ciphertext });
  return new Blob([payload], { type: "application/octet-stream" });
}

export async function decryptFilePayload(key: CryptoKey, encryptedBlob: Blob): Promise<Blob> {
  const text = await encryptedBlob.text();
  const parsed = JSON.parse(text) as { iv: string; ciphertext: string };
  const plain = await decryptBytes(key, parsed.ciphertext, parsed.iv);
  return new Blob([plain]);
}

export async function encryptMetadata(key: CryptoKey, metadata: object): Promise<string> {
  const enc = new TextEncoder();
  const { ciphertext, iv } = await encryptBytes(key, enc.encode(JSON.stringify(metadata)).buffer);
  return JSON.stringify({ iv, ciphertext });
}

export async function decryptMetadata<T>(key: CryptoKey, payload: string): Promise<T> {
  const parsed = JSON.parse(payload) as { iv: string; ciphertext: string };
  const plain = await decryptBytes(key, parsed.ciphertext, parsed.iv);
  const dec = new TextDecoder();
  return JSON.parse(dec.decode(plain)) as T;
}
