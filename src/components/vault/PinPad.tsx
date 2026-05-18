"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  title?: string;
  subtitle?: string;
  onComplete: (pin: string) => void | Promise<void>;
  disabled?: boolean;
  error?: string | null;
  maxLength?: number;
};

export function PinPad({
  title = "Enter Vault PIN",
  subtitle,
  onComplete,
  disabled,
  error,
  maxLength = 6,
}: Props) {
  const [pin, setPin] = useState("");

  function press(digit: string) {
    if (disabled || pin.length >= maxLength) return;
    const next = pin + digit;
    setPin(next);
    if (next.length >= 4 && next.length === maxLength) {
      void onComplete(next);
    }
  }

  function backspace() {
    setPin((p) => p.slice(0, -1));
  }

  function submit() {
    if (pin.length >= 4) void onComplete(pin);
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div className="mx-auto max-w-sm rounded-brand-lg border border-gold/25 bg-navy-lift p-6">
      <h2 className="text-center font-heading text-xl text-gold">{title}</h2>
      {subtitle && <p className="mt-2 text-center font-body text-sm text-cream/75">{subtitle}</p>}

      <div
        className="mt-6 flex justify-center gap-2"
        aria-live="polite"
        aria-label={`${pin.length} digits entered`}
      >
        {Array.from({ length: maxLength }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full border border-gold/40 ${
              i < pin.length ? "bg-gold" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-4 text-center font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2" role="group" aria-label="PIN keypad">
        {keys.map((k, i) =>
          k === "" ? (
            <span key={i} />
          ) : (
            <button
              key={k}
              type="button"
              disabled={disabled}
              onClick={() => (k === "⌫" ? backspace() : press(k))}
              className="rounded-brand-md border border-gold/30 bg-navy py-4 font-heading text-xl text-cream transition hover:border-gold hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50 motion-safe:active:scale-95 motion-reduce:active:scale-100"
            >
              {k}
            </button>
          ),
        )}
      </div>

      <GoldButton
        label="Unlock"
        onClick={submit}
        variant="solid"
        className="mt-4 w-full"
        disabled={disabled || pin.length < 4}
      />
    </div>
  );
}
