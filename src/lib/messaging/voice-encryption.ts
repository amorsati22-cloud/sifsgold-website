"use client";

import { decryptMessage, encryptMessage, type EncryptedPayload } from "@/lib/messaging/encryption";

export function encryptVoiceBlob(audioBytes: Uint8Array, threadKey: Uint8Array): EncryptedPayload {
  const b64 = btoa(String.fromCharCode(...audioBytes));
  return encryptMessage(b64, threadKey);
}

export function decryptVoiceBlob(ciphertext: string, iv: string, threadKey: Uint8Array): Uint8Array | null {
  const b64 = decryptMessage(ciphertext, iv, threadKey);
  if (!b64) return null;
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

/** Downsample recorded audio to ~32 bars for waveform UI */
export async function buildWaveformFromBlob(blob: Blob, bars = 32): Promise<number[]> {
  const ctx = new AudioContext();
  const buffer = await blob.arrayBuffer();
  const audio = await ctx.decodeAudioData(buffer.slice(0));
  const channel = audio.getChannelData(0);
  const block = Math.floor(channel.length / bars);
  const waveform: number[] = [];
  for (let i = 0; i < bars; i++) {
    let sum = 0;
    for (let j = 0; j < block; j++) sum += Math.abs(channel[i * block + j] ?? 0);
    waveform.push(sum / block);
  }
  const max = Math.max(...waveform, 0.001);
  await ctx.close();
  return waveform.map((v) => Math.round((v / max) * 100));
}
