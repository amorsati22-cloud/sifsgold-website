import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type Stripe from "stripe";

const LOG_PATH = path.join(process.cwd(), "data", "stripe-webhook-events.json");

export type StripeWebhookLogEntry = {
  id: string;
  type: string;
  created: number;
  receivedAt: string;
  summary: string;
  metadata?: Record<string, string | undefined>;
};

async function readLog(): Promise<StripeWebhookLogEntry[]> {
  try {
    const raw = await readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw) as StripeWebhookLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function logStripeWebhookEvent(
  event: Stripe.Event,
  summary: string,
  metadata?: Record<string, string | undefined>,
): Promise<void> {
  const entry: StripeWebhookLogEntry = {
    id: event.id,
    type: event.type,
    created: event.created,
    receivedAt: new Date().toISOString(),
    summary,
    metadata,
  };

  console.info("[stripe/webhook]", entry);

  try {
    await mkdir(path.dirname(LOG_PATH), { recursive: true });
    const existing = await readLog();
    const next = [entry, ...existing].slice(0, 200);
    await writeFile(LOG_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  } catch (error) {
    console.error("[stripe/webhook] failed to persist log", error);
  }
}
