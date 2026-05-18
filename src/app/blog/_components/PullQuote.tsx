"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

type PullQuoteProps = {
  children?: ReactNode;
  author?: string;
};

export function PullQuote({ children, author }: PullQuoteProps) {
  const theme = useTheme();

  return (
    <aside
      className="not-prose my-10 border-l-4 py-2 pl-6"
      style={{ borderColor: theme.colors.gold }}
      aria-label="Pull quote"
    >
      <p className="font-heading text-2xl font-bold leading-snug text-cream md:text-3xl">
        {children}
      </p>
      {author ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-gold-body">
          — {author}
        </p>
      ) : null}
    </aside>
  );
}
