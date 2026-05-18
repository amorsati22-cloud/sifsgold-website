"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import type { AvailabilityOverride, AvailabilityRule } from "@/types/booking";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Props = {
  proId: string;
  timezone: string;
  initialRules: AvailabilityRule[];
  initialOverrides: AvailabilityOverride[];
};

type DayRule = {
  day_of_week: number;
  enabled: boolean;
  start_time: string;
  end_time: string;
};

function rulesToDays(rules: AvailabilityRule[]): DayRule[] {
  return DAY_NAMES.map((_, day_of_week) => {
    const rule = rules.find((r) => r.day_of_week === day_of_week);
    return {
      day_of_week,
      enabled: Boolean(rule),
      start_time: rule?.start_time?.slice(0, 5) ?? "09:00",
      end_time: rule?.end_time?.slice(0, 5) ?? "17:00",
    };
  });
}

export function AvailabilityEditor({ proId, timezone, initialRules, initialOverrides }: Props) {
  const [days, setDays] = useState<DayRule[]>(() => rulesToDays(initialRules));
  const [overrides, setOverrides] = useState(initialOverrides);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideType, setOverrideType] = useState<AvailabilityOverride["type"]>("unavailable");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveRules() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/booking/availability-rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_id: proId, timezone, days }),
    });
    setSaving(false);
    setMessage(res.ok ? "Availability saved." : "Could not save availability.");
  }

  async function addOverride() {
    if (!overrideDate) return;
    const res = await fetch("/api/booking/availability-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pro_id: proId,
        override: { override_date: overrideDate, type: overrideType },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOverrides((o) => [...o, data.override]);
      setOverrideDate("");
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-heading text-xl text-gold">Weekly hours</h2>
        <p className="mt-1 font-body text-sm text-gold-body">Timezone: {timezone.replace(/_/g, " ")}</p>
        <ul className="mt-4 space-y-3">
          {days.map((day) => (
            <li
              key={day.day_of_week}
              className="flex flex-wrap items-center gap-3 rounded-brand-lg border border-gold/10 bg-navy/40 px-4 py-3"
            >
              <label className="flex min-w-[120px] items-center gap-2 font-body text-sm text-cream">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(e) =>
                    setDays((d) =>
                      d.map((x) =>
                        x.day_of_week === day.day_of_week ? { ...x, enabled: e.target.checked } : x,
                      ),
                    )
                  }
                  className="rounded border-gold/30 text-gold focus:ring-gold"
                />
                {DAY_NAMES[day.day_of_week]}
              </label>
              {day.enabled ? (
                <>
                  <input
                    type="time"
                    value={day.start_time}
                    onChange={(e) =>
                      setDays((d) =>
                        d.map((x) =>
                          x.day_of_week === day.day_of_week ? { ...x, start_time: e.target.value } : x,
                        ),
                      )
                    }
                    className="rounded border border-gold/20 bg-navy px-2 py-1 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
                  />
                  <span className="text-gold-body">–</span>
                  <input
                    type="time"
                    value={day.end_time}
                    onChange={(e) =>
                      setDays((d) =>
                        d.map((x) =>
                          x.day_of_week === day.day_of_week ? { ...x, end_time: e.target.value } : x,
                        ),
                      )
                    }
                    className="rounded border border-gold/20 bg-navy px-2 py-1 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
                  />
                </>
              ) : (
                <span className="font-body text-sm text-gold-body">Closed</span>
              )}
            </li>
          ))}
        </ul>
        <GoldButton
          label={saving ? "Saving…" : "Save weekly hours"}
          onClick={() => void saveRules()}
          variant="solid"
          size="lg"
          className={`mt-6 ${saving ? "pointer-events-none opacity-70" : ""}`}
        />
        {message ? <p className="mt-2 font-body text-sm text-gold-body">{message}</p> : null}
      </section>

      <section>
        <h2 className="font-heading text-xl text-gold">Time off & overrides</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="date"
            value={overrideDate}
            onChange={(e) => setOverrideDate(e.target.value)}
            className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
          />
          <select
            value={overrideType}
            onChange={(e) => setOverrideType(e.target.value as AvailabilityOverride["type"])}
            className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
          >
            <option value="unavailable">Day off</option>
            <option value="vacation">Vacation</option>
            <option value="holiday">Holiday</option>
          </select>
          <GoldButton label="Add override" onClick={() => void addOverride()} variant="outlined" size="md" />
        </div>
        <ul className="mt-4 space-y-2">
          {overrides.map((o) => (
            <li key={o.id} className="font-body text-sm text-cream/80">
              {o.override_date} — {o.type}
              {o.reason ? ` (${o.reason})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
