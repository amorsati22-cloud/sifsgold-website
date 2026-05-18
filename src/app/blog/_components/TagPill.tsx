"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

type TagPillProps = {
  tag: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
};

export function TagPill({ tag, href, active = false, onClick }: TagPillProps) {
  const theme = useTheme();
  const label = tag.replace(/-/g, " ");

  const className = [
    "inline-flex min-h-9 items-center rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    active
      ? "border-gold bg-gold/15 text-gold"
      : "border-white/20 bg-navy-light/40 text-cream/80 hover:border-gold/40 hover:text-gold",
  ].join(" ");

  const style = active
    ? { outlineColor: theme.colors.gold }
    : { outlineColor: theme.colors.gold };

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style} aria-pressed={active}>
      {label}
    </button>
  );
}
