import type { ReactNode } from "react";

type SectionBadgeProps = {
  children: ReactNode;
  className?: string;
};

export function SectionBadge({ children, className = "" }: SectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gold ${className}`.trim()}
    >
      {children}
    </span>
  );
}
