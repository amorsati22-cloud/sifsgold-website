"use client";

const ROWS = [
  { label: "Identifiers (name, email, device)", on: true },
  { label: "Commercial information (purchases, subscriptions)", on: false },
  { label: "Internet activity (product usage, diagnostics)", on: false },
  { label: "Geolocation (coarse region for compliance)", on: false },
] as const;

export function DoNotSellOptOutIllustration() {
  return (
    <div className="mt-6 rounded-brand-md border border-gold/20 bg-navy p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-body">Illustration — not connected to accounts</p>
      <ul className="mt-4 space-y-3" role="list">
        {ROWS.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3 text-sm text-cream/90">
            <span>{row.label}</span>
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Placeholder — CCPA controls ship with launch"
              className={`relative h-8 w-14 shrink-0 rounded-full border border-gold/40 ${
                row.on ? "bg-teal/25" : "bg-navy-deep"
              }`}
            >
              <span
                className={`absolute top-0.5 h-7 w-7 rounded-full border border-gold/50 bg-cream ${
                  row.on ? "left-7" : "left-0.5"
                }`}
                aria-hidden
              />
              <span className="sr-only">{row.on ? "On (illustration)" : "Off (illustration)"}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
