"use client";

import { SectionReveal } from "@/components/sections/SectionReveal";

const STATE_ABBR = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

const CE_TEASER = [
  { state: "California", hours: "Renewal cycles vary by license type — commonly 4–8 CE hours per renewal window." },
  { state: "New York", hours: "CE expectations differ by original licensure date — track hours inside Education." },
  { state: "Texas", hours: "TDLR licensees typically complete hours each renewal — exact totals shown in-app by pathway." },
  { state: "Florida", hours: "DBPR licensees track continuing education per board rule — reminders sync to renewal dates." },
  { state: "Illinois", hours: "IDFPR renewals include CE categories — we surface category gaps early." },
] as const;

export function FeatureStateBoardsExtras() {
  return (
    <>
      <section className="border-b border-gold/10 bg-navy-deep/40 py-16 md:py-20" aria-labelledby="state-map-heading">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id="state-map-heading" className="font-heading text-3xl text-gold md:text-4xl">
              National coverage map (preview)
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-cream/80">
              All states ship gold at launch for board prep coverage — darker shading will indicate refreshed item banks as
              updates roll. This static preview uses uniform gold tiles to match launch messaging.
            </p>
            <div
              className="mt-10 rounded-brand-lg border border-gold/30 bg-navy-deep/70 p-6"
              role="img"
              aria-label="United States board prep coverage: all states highlighted gold at launch"
            >
              <svg viewBox="0 0 960 520" className="h-auto w-full text-gold" aria-hidden>
                <title>Stylized United States outline</title>
                <path
                  fill="currentColor"
                  fillOpacity={0.35}
                  stroke="currentColor"
                  strokeWidth={2}
                  d="M120 380 L180 120 L360 80 L520 100 L780 140 L820 260 L760 420 L540 460 L320 440 Z"
                />
                <text x="80" y="480" className="fill-cream text-sm font-body">
                  Stylized map — geographic accuracy not implied.
                </text>
              </svg>
              <ul className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10" role="list">
                {STATE_ABBR.map((abbr) => (
                  <li
                    key={abbr}
                    className="rounded border border-gold/50 bg-gold/15 px-1 py-2 text-center font-body text-xs font-semibold text-gold"
                  >
                    {abbr}
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-16 md:py-20" aria-labelledby="ce-teaser-heading">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 id="ce-teaser-heading" className="font-heading text-3xl text-gold md:text-4xl">
              CE hour requirements (teaser)
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-cream/80">
              Exact totals vary by license type and issuance date — the live product links to authoritative board sources.
              This table is a non-exhaustive preview.
            </p>
            <div className="mt-8 overflow-x-auto rounded-brand-lg border border-gold/25">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm text-cream">
                <caption className="border-b border-gold/20 bg-navy-deep/80 px-4 py-3 text-left font-heading text-gold">
                  Sample states — verify with your board before relying on totals
                </caption>
                <thead className="bg-navy-deep/90">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-gold">
                      State
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-gold">
                      CE snapshot (teaser)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CE_TEASER.map((row) => (
                    <tr key={row.state} className="border-t border-gold/15 odd:bg-navy-deep/40">
                      <th scope="row" className="px-4 py-3 font-medium text-cream">
                        {row.state}
                      </th>
                      <td className="px-4 py-3 text-cream/85">{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
