type Kpi = { label: string; value: string };

export function SchoolKpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-brand-lg border border-gold/15 bg-navy/40 px-4 py-5">
          <p className="font-body text-xs uppercase tracking-wide text-gold-body">{k.label}</p>
          <p className="mt-1 font-heading text-2xl text-gold">{k.value}</p>
        </div>
      ))}
    </div>
  );
}
