"use client";

import { useMemo, useState } from "react";
import { GLOSSARY_TERMS } from "@/data/glossary";

export function GlossaryClient() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (row) => row.term.toLowerCase().includes(needle) || row.definition.toLowerCase().includes(needle),
    );
  }, [q]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof GLOSSARY_TERMS>();
    for (const row of filtered) {
      const letter = row.term.charAt(0).toUpperCase();
      const bucket = /[A-Z]/.test(letter) ? letter : "#";
      if (!map.has(bucket)) map.set(bucket, []);
      map.get(bucket)!.push(row);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div>
      <label htmlFor="glossary-search" className="sr-only">
        Search glossary
      </label>
      <input
        id="glossary-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search terms or definitions…"
        className="w-full max-w-xl rounded-xl border border-gold/25 bg-navy-deep/80 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <p className="mt-2 text-xs text-cream/60">
        Showing {filtered.length} of {GLOSSARY_TERMS.length} starter entries — more ship with the editorial calendar.
      </p>

      <div className="mt-10 space-y-12">
        {groups.map(([letter, rows]) => (
          <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`}>
            <h2 id={`heading-${letter}`} className="font-heading text-2xl text-gold">
              {letter}
            </h2>
            <dl className="mt-4 divide-y divide-gold/10 rounded-brand-lg border border-gold/15 bg-navy-deep/60">
              {rows.map((row) => (
                <div key={row.term} className="px-4 py-4 md:px-6">
                  <dt className="font-heading text-lg text-cream">{row.term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-cream/80">{row.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
