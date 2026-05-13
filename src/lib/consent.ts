export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: false;
  timestamp: string;
};

type LegacyAcceptedState = {
  accepted: true;
  timestamp: string;
};

export const CONSENT_STORAGE_KEY = "sifsGold_cookie_consent";
export const CONSENT_UPDATED_EVENT = "sifsgold:consent-updated";
export const OPEN_COOKIE_PREFERENCES_EVENT = "sifsgold:open-cookie-preferences";

function isConsentState(value: unknown): value is ConsentState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ConsentState>;
  return (
    candidate.essential === true &&
    typeof candidate.analytics === "boolean" &&
    candidate.marketing === false &&
    typeof candidate.timestamp === "string"
  );
}

function isLegacyAcceptedState(value: unknown): value is LegacyAcceptedState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LegacyAcceptedState>;
  return candidate.accepted === true && typeof candidate.timestamp === "string";
}

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (isConsentState(parsed)) {
      return parsed;
    }

    if (isLegacyAcceptedState(parsed)) {
      return {
        essential: true,
        analytics: true,
        marketing: false,
        timestamp: parsed.timestamp,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function setConsent(consent: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
}

export function hasAcceptedAnalytics(): boolean {
  return getConsent()?.analytics === true;
}
