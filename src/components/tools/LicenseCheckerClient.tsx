"use client";

import { useMemo, useState } from "react";
import { ALL_STATE_SLUGS, STATE_BOARD_STUBS } from "@/data/states";

export function LicenseCheckerClient() {
  const [state, setState] = useState("mn");
  const [licenseId, setLicenseId] = useState("cosmetology");
  const [lastRenewal, setLastRenewal] = useState("");

  const stub = STATE_BOARD_STUBS[state];
  const license = stub?.licenseTypesForChecker.find((l) => l.id === licenseId);

  const renewal = useMemo(() => {
    if (!license) return null;
    const parsed = Date.parse(lastRenewal);
    const base = Number.isFinite(parsed) ? new Date(parsed) : new Date();
    if (!Number.isFinite(parsed)) return { next: null as Date | null, cycle: license.renewalCycleYears, ce: license.ceHoursRequired };
    const next = new Date(base);
    next.setFullYear(next.getFullYear() + license.renewalCycleYears);
    return { next, cycle: license.renewalCycleYears, ce: license.ceHoursRequired };
  }, [lastRenewal, license]);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="state-select">
          State / district
        </label>
        <select
          id="state-select"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          {[...ALL_STATE_SLUGS].sort().map((slug) => (
            <option key={slug} value={slug}>
              {STATE_BOARD_STUBS[slug]?.displayName ?? slug.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="lic-select">
          License type
        </label>
        <select
          id="lic-select"
          value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          {stub?.licenseTypesForChecker.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="last-renewal">
          Last renewal date (optional)
        </label>
        <input
          id="last-renewal"
          type="date"
          value={lastRenewal}
          onChange={(e) => setLastRenewal(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <p className="mt-1 text-xs text-cream/55">Leave blank to preview cycle rules without a computed deadline.</p>
      </div>

      {license && renewal ? (
        <div className="rounded-brand-lg border border-gold/30 bg-navy-deep/80 p-6 text-sm text-cream/85">
          <p>
            <span className="text-cream/60">Renewal cycle:</span>{" "}
            <strong className="text-gold">{renewal.cycle} year(s)</strong>
          </p>
          <p className="mt-2">
            <span className="text-cream/60">CE hours (stub):</span>{" "}
            <strong className="text-gold">{renewal.ce}</strong> per cycle — verify with board notice.
          </p>
          {renewal.next ? (
            <p className="mt-2">
              <span className="text-cream/60">Next renewal target:</span>{" "}
              <strong className="text-cream">{renewal.next.toLocaleDateString()}</strong>
            </p>
          ) : (
            <p className="mt-2 text-cream/70">Enter your last renewal date to estimate the next deadline.</p>
          )}
          <p className="mt-4 text-xs text-cream/55">
            Data sourced from marketing stubs in <code className="text-gold/90">states.ts</code> — not legal advice.
          </p>
        </div>
      ) : null}
    </div>
  );
}
