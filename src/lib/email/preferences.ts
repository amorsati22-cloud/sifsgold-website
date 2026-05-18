import "server-only";

import fs from "node:fs";
import path from "node:path";

export type EmailPreferenceRecord = {
  email: string;
  marketingOptOut: boolean;
  updatedAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data/email-preferences.json");

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

async function readJsonStore(): Promise<Record<string, EmailPreferenceRecord>> {
  if (!fs.existsSync(DATA_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw) as Record<string, EmailPreferenceRecord>;
  } catch {
    return {};
  }
}

async function writeJsonStore(data: Record<string, EmailPreferenceRecord>): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function kvAvailable(): Promise<boolean> {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvGet(email: string): Promise<EmailPreferenceRecord | null> {
  if (!(await kvAvailable())) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<EmailPreferenceRecord>(`email-pref:${email}`)) ?? null;
  } catch {
    return null;
  }
}

async function kvSet(record: EmailPreferenceRecord): Promise<void> {
  if (!(await kvAvailable())) return;
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(`email-pref:${record.email}`, record);
  } catch {
    // fall through to JSON
  }
}

export async function getEmailPreference(email: string): Promise<EmailPreferenceRecord | null> {
  const key = normalizeEmail(email);
  const fromKv = await kvGet(key);
  if (fromKv) return fromKv;
  const store = await readJsonStore();
  return store[key] ?? null;
}

export async function setMarketingOptOut(email: string, optOut: boolean): Promise<EmailPreferenceRecord> {
  const key = normalizeEmail(email);
  const record: EmailPreferenceRecord = {
    email: key,
    marketingOptOut: optOut,
    updatedAt: new Date().toISOString(),
  };

  await kvSet(record);

  const store = await readJsonStore();
  store[key] = record;
  await writeJsonStore(store);

  return record;
}

export async function isMarketingOptedOut(email: string): Promise<boolean> {
  const pref = await getEmailPreference(email);
  return pref?.marketingOptOut === true;
}
