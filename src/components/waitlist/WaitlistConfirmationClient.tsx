"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { labelForSignupUserTypeSlug } from "@/data/signup-user-types";
import { BRAND } from "@/lib/constants";

function buildShareText(userLabel: string | null) {
  const role = userLabel ? ` as a ${userLabel}` : "";
  return `I'm in Sif's Circle${role}. Beauty, grooming, fitness & fashion on one platform: ${BRAND.url}`;
}

export function WaitlistConfirmationClient() {
  const searchParams = useSearchParams();
  const userTypeSlug = searchParams.get("userType");
  const userLabel = useMemo(() => labelForSignupUserTypeSlug(userTypeSlug), [userTypeSlug]);
  const shareText = useMemo(() => buildShareText(userLabel), [userLabel]);
  const encodedUrl = encodeURIComponent(BRAND.url);
  const encodedText = encodeURIComponent(shareText);
  const [nativeShareError, setNativeShareError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareNative = useCallback(async () => {
    setNativeShareError(false);
    if (typeof navigator === "undefined" || !navigator.share) {
      setNativeShareError(true);
      return;
    }
    try {
      await navigator.share({
        title: "Sif's Gold",
        text: shareText,
        url: BRAND.url,
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setNativeShareError(true);
    }
  }, [shareText]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareText]);

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-gold/10 text-gold shadow-[0_0_40px_rgba(212,175,55,0.25)]">
        <Check className="h-10 w-10 stroke-[3]" aria-hidden />
      </div>
      <h1 className="mt-8 font-heading text-4xl font-bold tracking-tight text-gold md:text-5xl">You&apos;re in Sif&apos;s Circle.</h1>
      <p className="mt-4 text-lg text-cream/90">
        Welcome. We&apos;ll be in touch as we get closer to launch.
      </p>
      {userLabel ? (
        <p className="mt-3 text-sm text-cream/75">
          You chose <span className="font-semibold text-gold">{userLabel}</span> — you can add more roles later in the app.
        </p>
      ) : null}

      <section className="mt-10 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 text-left">
        <h2 className="font-heading text-xl text-gold">What happens next</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-cream/85">
          <li>Welcome message within 24 hours of joining the list.</li>
          <li>Founding perks unlock at launch; early access begins before the public opening.</li>
          <li>We&apos;ll share launch timing, product updates, and how to get into the app first.</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="share-heading">
        <h2 id="share-heading" className="font-heading text-lg text-gold">
          Share Sif&apos;s Gold
        </h2>
        <p className="mt-2 text-sm text-cream/70">Use your device share sheet when available, or pick a network below.</p>
        <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {canNativeShare ? (
            <button
              type="button"
              onClick={shareNative}
              className="rounded-xl border border-gold/40 bg-gold/15 px-4 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/25"
            >
              Share…
            </button>
          ) : null}
          {nativeShareError ? (
            <p className="text-xs text-cream/60 sm:w-full sm:text-center">Sharing isn&apos;t available here — use a link below.</p>
          ) : null}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-offwhite transition hover:border-gold/40 hover:text-gold"
          >
            X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-offwhite transition hover:border-gold/40 hover:text-gold"
          >
            Facebook
          </a>
          <a
            href={`https://www.threads.net/intent/post?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-offwhite transition hover:border-gold/40 hover:text-gold"
          >
            Threads
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-offwhite transition hover:border-gold/40 hover:text-gold"
          >
            {copied ? "Copied" : "Instagram / TikTok (copy text)"}
          </button>
        </div>
        <p className="mt-3 text-xs text-cream/55">
          Instagram and TikTok open best from the native apps — copy the text above, then paste into a new post or story.
        </p>
      </section>

      <p className="mt-12 text-sm text-cream/70">Tell a friend who&apos;d love this.</p>
    </div>
  );
}
