import type { ReactNode } from "react";

export type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  tag?: string;
  className?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  tag,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold/30 ${className}`.trim()}
    >
      <div className="mb-4 inline-flex rounded-full bg-gold/10 p-2 text-gold">{icon}</div>
      <h3 className="font-heading text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>
      {tag ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-gold/80">{tag}</p>
      ) : null}
    </div>
  );
}
