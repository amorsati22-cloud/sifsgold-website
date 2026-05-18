"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { optInHealthHub } from "@/lib/health-hub/actions";
import { GoldButton } from "@/components/ui/GoldButton";
import {
  HEALTH_DISCLAIMER_SHORT,
  OPT_IN_BODY,
  OPT_IN_HEADLINE,
  PRIVACY_REMINDER,
} from "@/lib/health-hub/constants";
import Link from "next/link";

export function OptInScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOptIn() {
    setPending(true);
    setError(null);
    const result = await optInHealthHub();
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div
      className="rounded-brand-lg border border-gold/20 p-6 md:p-10"
      style={{ backgroundColor: theme.colors.navyDeep }}
    >
      <h2 className="font-heading text-2xl font-bold text-gold">{OPT_IN_HEADLINE}</h2>
      <p className="mt-3 font-body text-cream/90">{OPT_IN_BODY}</p>
      <p className="mt-4 font-body text-sm text-goldBody">{PRIVACY_REMINDER}</p>
      <p className="mt-4 font-body text-sm text-cream/75">{HEALTH_DISCLAIMER_SHORT}</p>

      <ul className="mt-6 list-disc space-y-2 pl-5 font-body text-sm text-cream/85">
        <li>Daily Pulse — mood, energy, sleep awareness</li>
        <li>Cycle Sync — wellness tracking only (no fertility prediction)</li>
        <li>Medication Tracker — logging only, no dosing advice</li>
        <li>Hydration — goals capped at 64–100 oz/day</li>
        <li>Pre-shift Ritual — recovery and mindfulness for physical work</li>
      </ul>

      <p className="mt-6 font-body text-xs text-cream/60">
        Read the full{" "}
        <Link
          href="/dashboard/health-hub/disclaimer"
          className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Health Hub disclaimer
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          privacy policy
        </Link>
        .
      </p>

      {error ? (
        <p className="mt-4 font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <GoldButton
          label={pending ? "Enabling…" : "Enable Health Hub"}
          onClick={handleOptIn}
          variant="solid"
        />
        <GoldButton label="Back to dashboard" href="/dashboard" variant="outlined" />
      </div>
    </div>
  );
}
