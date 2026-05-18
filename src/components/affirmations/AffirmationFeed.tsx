"use client";

import { useCallback, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { toPng } from "html-to-image";
import { AffirmationShareCard } from "@/components/affirmations/AffirmationShareCard";
import { CATEGORY_LABELS } from "@/lib/affirmations/constants";
import { fetchNextAffirmation, saveAffirmation, shareAffirmation } from "@/lib/affirmations/actions";
import type { AffirmationAudience, AffirmationCategory } from "@/types/affirmations";

type Card = { id: string; text: string; category: AffirmationCategory };

type Props = {
  initial: Card;
  audience: AffirmationAudience;
  signedIn: boolean;
};

export function AffirmationFeed({ initial, audience, signedIn }: Props) {
  const [card, setCard] = useState<Card>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [swipeDir, setSwipeDir] = useState(1);
  const shareRef = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    opacity: 1,
    transform: "translateX(0%)",
    from: { opacity: 0, transform: `translateX(${swipeDir * 12}%)` },
    reset: true,
    config: { tension: 280, friction: 26 },
  });

  const loadNext = useCallback(async () => {
    setSwipeDir(1);
    const res = await fetchNextAffirmation(audience);
    if (res.ok && res.affirmation) {
      setCard(res.affirmation as Card);
      setMessage(null);
    }
  }, [audience]);

  async function handleSave() {
    const res = await saveAffirmation(card.id);
    setMessage(res.ok ? "Saved to your collection." : res.error ?? "Could not save.");
  }

  async function handleShare(platform: string) {
    if (shareRef.current) {
      try {
        const dataUrl = await toPng(shareRef.current, { pixelRatio: 2, cacheBust: true });
        const link = document.createElement("a");
        link.download = "sifs-gold-affirmation.png";
        link.href = dataUrl;
        link.click();
      } catch {
        setMessage("Could not generate image — try again.");
      }
    }
    if (signedIn) await shareAffirmation(card.id, platform);
    setMessage("Share image downloaded. Post with your own caption on social.");
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <animated.div
        style={spring}
        className="rounded-2xl border border-gold/35 bg-gradient-to-b from-navy-deep/90 to-navy-light/40 p-10 text-center shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-goldBody">
          {CATEGORY_LABELS[card.category]}
        </p>
        <p className="mt-6 font-heading text-2xl leading-relaxed text-cream md:text-3xl">{card.text}</p>
      </animated.div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => void loadNext()}
          className="rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Next affirmation
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          className="rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => void handleShare("instagram")}
          className="rounded-full border border-gold/40 px-5 py-2.5 text-sm text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Share
        </button>
      </div>

      {message ? <p className="text-center text-sm text-goldBody">{message}</p> : null}

      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <AffirmationShareCard ref={shareRef} text={card.text} category={card.category} />
      </div>

      <p className="text-center text-xs text-cream/55">
        Positive-only affirmations — original to Sif&apos;s Gold. Tailored for{" "}
        {audience === "pros" ? "professionals" : audience === "students" ? "students" : "clients"}.
      </p>
    </div>
  );
}
