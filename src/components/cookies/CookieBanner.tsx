"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_UPDATED_EVENT,
  OPEN_COOKIE_PREFERENCES_EVENT,
  getConsent,
  setConsent,
} from "@/lib/consent";

export function CookieBanner() {
  const [isReady, setIsReady] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setIsBannerVisible(false);
    } else {
      setIsBannerVisible(true);
    }
    setIsReady(true);

    const openPreferences = () => {
      const existing = getConsent();
      setAnalyticsEnabled(existing?.analytics ?? false);
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setIsDialogOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    const container = dialogRef.current;
    if (!container) {
      return;
    }

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    firstFocusable?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDialogOpen(false);
        return;
      }

      if (event.key === "Tab" && focusables.length > 0) {
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && active === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        } else if (!event.shiftKey && active === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isDialogOpen]);

  useEffect(() => {
    if (isDialogOpen) return;
    lastFocusedRef.current?.focus();
  }, [isDialogOpen]);

  if (!isReady) {
    return null;
  }

  const emitConsentUpdated = () => {
    window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
  };

  const onAcceptAll = () => {
    const timestamp = new Date().toISOString();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ accepted: true, timestamp }),
    );
    emitConsentUpdated();
    setIsBannerVisible(false);
    setIsDialogOpen(false);
  };

  const onSavePreferences = () => {
    setConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    emitConsentUpdated();
    setIsBannerVisible(false);
    setIsDialogOpen(false);
  };

  return (
    <>
      {isBannerVisible ? (
        <section
          aria-label="Cookie consent banner"
          className="fixed inset-x-0 bottom-0 z-[130] border-t border-gold/30 bg-navy-deep/95 px-4 py-4 backdrop-blur-sm motion-safe:animate-in motion-reduce:animate-none sm:px-6"
        >
          <div className="mx-auto flex max-w-content flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-cream/90">
              We use only essential cookies to make Sif&apos;s Gold work. We don&apos;t use
              marketing cookies. We don&apos;t sell your data.{" "}
              <Link
                href="/legal/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold underline underline-offset-4 hover:text-gold-light"
              >
                Cookie Policy
              </Link>
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onAcceptAll}
                className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => {
                  lastFocusedRef.current = document.activeElement as HTMLElement | null;
                  setIsDialogOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-full border border-gold/60 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-brand-fast hover:bg-gold/10"
              >
                Manage preferences
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {isDialogOpen ? (
        <div
          className="fixed inset-0 z-[140] flex items-end justify-center bg-navy/80 p-4 sm:items-center"
          role="presentation"
          onClick={() => setIsDialogOpen(false)}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            aria-describedby="cookie-preferences-description"
            className="w-full max-w-2xl rounded-brand-lg border border-gold/30 bg-navy-deep p-5 text-cream shadow-nav sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="cookie-preferences-title" className="font-heading text-3xl text-gold">
              Cookie Preferences
            </h2>
            <p id="cookie-preferences-description" className="mt-2 text-sm text-cream/80">
              Control how Sif&apos;s Gold stores non-essential preferences on your device.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-brand-md border border-gold/20 bg-navy p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-cream">Essential</p>
                    <p className="mt-1 text-sm text-cream/75">
                      Required for the site to function
                    </p>
                  </div>
                  <span className="rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-semibold text-cream">
                    Always on
                  </span>
                </div>
              </div>

              <div className="rounded-brand-md border border-gold/20 bg-navy p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-cream">Analytics (cookieless)</p>
                    <p className="mt-1 text-sm text-cream/75">
                      Vercel Web Analytics and Speed Insights run without third-party cookies — aggregate
                      page views and performance only.
                    </p>
                  </div>
                  <span className="rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-semibold text-cream">
                    Always on
                  </span>
                </div>
              </div>

              <div className="rounded-brand-md border border-gold/20 bg-navy p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-cream">Marketing</p>
                    <p className="mt-1 text-sm text-cream/75">
                      We don&apos;t use marketing cookies right now
                    </p>
                  </div>
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
                    Off
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-gold/60 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-brand-fast hover:bg-gold/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSavePreferences}
                className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20"
              >
                Save preferences
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
