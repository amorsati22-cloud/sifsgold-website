"use client";

import nacl from "tweetnacl";

function utf8ToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

/**
 * Group shared secret — re-derived when group_key_version or participants change.
 * All group messages use this key (TweetNaCl secretbox, same as DMs).
 */
export function deriveGroupThreadKey(
  threadId: string,
  participantIds: string[],
  keyVersion: number,
): Uint8Array {
  const material = `group:${threadId}:v${keyVersion}:${[...participantIds].sort().join(":")}`;
  return nacl.hash(utf8ToBytes(material)).slice(0, nacl.secretbox.keyLength);
}

/** DM / appointment threads (2-party deterministic key, no rotation). */
export function deriveDmThreadKey(threadId: string, participantIds: string[]): Uint8Array {
  const material = `${threadId}:${[...participantIds].sort().join(":")}`;
  return nacl.hash(utf8ToBytes(material)).slice(0, nacl.secretbox.keyLength);
}

export function deriveThreadKeyForType(
  threadId: string,
  participantIds: string[],
  threadType: string,
  groupKeyVersion = 1,
): Uint8Array {
  if (threadType === "group") {
    return deriveGroupThreadKey(threadId, participantIds, groupKeyVersion);
  }
  return deriveDmThreadKey(threadId, participantIds);
}
