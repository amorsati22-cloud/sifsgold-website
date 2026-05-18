"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  registerServiceWorker,
  subscribeToWebPush,
  subscriptionToPayload,
  unsubscribeFromWebPush,
} from "@/lib/notifications/client-push";
import { NOTIFICATION_CATEGORIES } from "@/lib/notifications/types";

type Prefs = {
  push_enabled: boolean;
  email_enabled: boolean;
  digest_frequency: string;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  categories: Record<string, { in_app?: boolean; push?: boolean; email?: boolean }>;
};

export function NotificationPreferencesClient() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications/preferences");
    const data = await res.json();
    if (res.ok) setPrefs(data.preferences);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(patch: Partial<Prefs>) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not save");
      return;
    }
    setPrefs(data.preferences);
    setMessage("Saved");
  }

  async function enablePush() {
    setBusy(true);
    setMessage(null);
    const keyRes = await fetch("/api/notifications/vapid-public-key");
    const keyData = await keyRes.json();
    if (!keyRes.ok) {
      setBusy(false);
      setMessage("Web push is not configured on this environment.");
      return;
    }
    await registerServiceWorker();
    const sub = await subscribeToWebPush(keyData.publicKey);
    if (!sub) {
      setBusy(false);
      setMessage("Permission denied or push unsupported in this browser.");
      return;
    }
    const payload = subscriptionToPayload(sub);
    const res = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: payload.endpoint, keys: payload.keys }),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("Could not register subscription");
      return;
    }
    await load();
    setMessage("Push notifications enabled");
  }

  async function disablePush() {
    await unsubscribeFromWebPush();
    await fetch("/api/notifications/subscribe", { method: "DELETE" });
    await load();
    setMessage("Push disabled");
  }

  if (!prefs) return <p className="px-4 py-8 text-cream/70">Loading preferences…</p>;

  const input =
    "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-sm text-cream";

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8">
      <Link href="/dashboard/notifications" className="text-sm text-gold underline">
        Back to notifications
      </Link>
      <h1 className="font-display text-2xl text-gold">Notification preferences</h1>
      {message ? <p className="text-sm text-goldBody">{message}</p> : null}

      <section className="space-y-3 rounded-brand-lg border border-gold/20 p-4">
        <h2 className="font-display text-lg text-gold">Channels</h2>
        <label className="flex items-center justify-between text-sm text-cream">
          Email notifications
          <input
            type="checkbox"
            checked={prefs.email_enabled}
            onChange={(e) => void save({ email_enabled: e.target.checked })}
          />
        </label>
        <p className="text-sm text-cream/70">
          Browser push: {prefs.push_enabled ? "On" : "Off"}
        </p>
        {prefs.push_enabled ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void disablePush()}
            className="rounded-full border border-gold/30 px-4 py-2 text-sm text-cream"
          >
            Turn off push
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => void enablePush()}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
          >
            Enable browser push
          </button>
        )}
        <label className="block text-sm text-cream">
          Digest frequency
          <select
            value={prefs.digest_frequency}
            onChange={(e) => void save({ digest_frequency: e.target.value })}
            className={input}
          >
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </section>

      <section className="space-y-3 rounded-brand-lg border border-gold/20 p-4">
        <h2 className="font-display text-lg text-gold">Quiet hours (UTC)</h2>
        <label className="block text-sm text-cream">
          Start
          <input
            type="time"
            value={prefs.quiet_hours_start ?? ""}
            onChange={(e) => void save({ quiet_hours_start: e.target.value || null })}
            className={input}
          />
        </label>
        <label className="block text-sm text-cream">
          End
          <input
            type="time"
            value={prefs.quiet_hours_end ?? ""}
            onChange={(e) => void save({ quiet_hours_end: e.target.value || null })}
            className={input}
          />
        </label>
      </section>

      <section className="space-y-3 rounded-brand-lg border border-gold/20 p-4">
        <h2 className="font-display text-lg text-gold">Categories</h2>
        {NOTIFICATION_CATEGORIES.map((cat) => {
          const c = prefs.categories[cat] ?? {};
          return (
            <div key={cat} className="border-b border-gold/10 pb-2">
              <p className="text-sm font-medium capitalize text-cream">{cat.replace("_", " ")}</p>
              <label className="mr-4 text-xs text-cream/70">
                <input
                  type="checkbox"
                  checked={c.push !== false}
                  onChange={(e) => {
                    const categories = { ...prefs.categories, [cat]: { ...c, push: e.target.checked } };
                    void save({ categories });
                  }}
                />{" "}
                Push
              </label>
              <label className="text-xs text-cream/70">
                <input
                  type="checkbox"
                  checked={c.email !== false}
                  onChange={(e) => {
                    const categories = { ...prefs.categories, [cat]: { ...c, email: e.target.checked } };
                    void save({ categories });
                  }}
                />{" "}
                Email
              </label>
            </div>
          );
        })}
      </section>
    </div>
  );
}
