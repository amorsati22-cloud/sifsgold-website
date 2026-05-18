"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { STATE_BOARD_STUBS, ALL_STATE_SLUGS } from "@/data/states";
import { calculateLicenseRenewal } from "@/lib/tools/formulas";

export function LicenseRenewalClient() {
  const [state, setState] = useState("tx");
  const [licenseType, setLicenseType] = useState("cosmetology");
  const [expiration, setExpiration] = useState("2026-12-01");
  const [ceDone, setCeDone] = useState("4");
  const [reminderDays, setReminderDays] = useState("30");

  const stub = STATE_BOARD_STUBS[state];
  const license = stub?.licenseTypesForChecker.find((l) => l.id === licenseType);
  const ceRequired = license?.ceHoursRequired ?? stub?.ceHoursPerRenewal ?? 0;

  const result = useMemo(
    () =>
      calculateLicenseRenewal({
        expirationDateIso: expiration,
        ceHoursRequired: ceRequired,
        ceHoursCompleted: Number.parseFloat(ceDone) || 0,
        reminderDays: Number.parseInt(reminderDays, 10) || 30,
      }),
    [expiration, ceRequired, ceDone, reminderDays],
  );

  return (
    <Calculator
      toolName="license-renewal-tracker"
      getPresetData={() => ({ state, licenseType, expiration, ceDone, reminderDays })}
      disclaimers={[
        "State requirements are illustrative stubs — verify renewal windows with your board.",
        "Email reminders: save preset while signed in; automated emails roll out with notification settings.",
      ]}
      results={
        <div className="space-y-2 text-sm">
          {result.expired ? (
            <p className="text-gold">License appears expired — renew immediately with your board.</p>
          ) : (
            <p>
              <span className="text-cream/70">Days until expiration: </span>
              <span className="font-heading text-2xl text-gold">{result.daysUntilExpiration}</span>
            </p>
          )}
          <p>CE remaining: {result.ceHoursRemaining} of {ceRequired} hours</p>
          {result.shouldRemind ? (
            <p className="text-goldBody">
              Reminder window active ({reminderDays} days) — enable email alerts in account settings when
              available.
            </p>
          ) : null}
          {stub ? (
            <p className="text-xs text-cream/55">{stub.ceRequirements}</p>
          ) : null}
        </div>
      }
    >
      <div>
        <label className="text-sm text-offwhite">State</label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
        >
          {ALL_STATE_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {STATE_BOARD_STUBS[slug]?.displayName ?? slug.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <select
        value={licenseType}
        onChange={(e) => setLicenseType(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      >
        {(stub?.licenseTypesForChecker ?? []).map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
      <GlassInput type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
      <GlassInput value={ceDone} onChange={(e) => setCeDone(e.target.value)} placeholder="CE hours completed" />
      <GlassInput
        value={reminderDays}
        onChange={(e) => setReminderDays(e.target.value)}
        placeholder="Remind me (days before)"
      />
    </Calculator>
  );
}
