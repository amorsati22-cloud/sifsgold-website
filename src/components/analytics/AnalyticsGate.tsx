"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CONSENT_UPDATED_EVENT, hasAcceptedAnalytics } from "@/lib/consent";

export function AnalyticsGate() {
  const [isMounted, setIsMounted] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => setAnalyticsEnabled(hasAcceptedAnalytics());
    setIsMounted(true);
    syncConsent();

    window.addEventListener(CONSENT_UPDATED_EVENT, syncConsent);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, syncConsent);
  }, []);

  if (!isMounted || !analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
