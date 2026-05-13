"use client";

import type { InputHTMLAttributes } from "react";

export type GlassInputProps = InputHTMLAttributes<HTMLInputElement>;

export function GlassInput({ className = "", ...props }: GlassInputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite shadow-sm outline-none ring-gold/20 backdrop-blur-sm placeholder:text-white/40 focus:border-gold focus:ring-4 ${className}`.trim()}
    />
  );
}
