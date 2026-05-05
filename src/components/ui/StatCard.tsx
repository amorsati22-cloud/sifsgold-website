export type StatCardProps = {
  number: string;
  label: string;
  sublabel?: string;
  className?: string;
};

export function StatCard({ number, label, sublabel, className = "" }: StatCardProps) {
  return (
    <div className={className}>
      <p className="font-heading text-4xl font-bold text-gold">{number}</p>
      <p className="mt-1 font-medium text-white">{label}</p>
      {sublabel ? <p className="mt-1 text-xs text-white/50">{sublabel}</p> : null}
    </div>
  );
}
