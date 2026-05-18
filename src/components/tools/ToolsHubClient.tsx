"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { TOOLS } from "@/lib/tools/registry";
import { getRecentTools } from "@/lib/tools/recent";
import type { ToolSlug } from "@/types/tools";

export function ToolsHubClient({ signedIn }: { signedIn: boolean }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<ToolSlug[]>([]);

  useEffect(() => {
    setRecent(getRecentTools());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.includes(q),
    );
  }, [query]);

  const recentTools = recent
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <div className="space-y-10">
      <label className="block">
        <span className="sr-only">Search tools</span>
        <input
          type="search"
          placeholder="Search calculators…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite placeholder:text-white/40 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </label>

      {signedIn && recentTools.length > 0 ? (
        <section>
          <h2 className="font-heading text-xl text-gold">Recently used</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {recentTools.map((t) =>
              t ? (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="rounded-full border border-gold/30 px-3 py-1 text-sm text-gold hover:bg-gold/10"
                  >
                    {t.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      {!signedIn && recentTools.length > 0 ? (
        <section>
          <h2 className="font-heading text-xl text-gold">Recently used</h2>
          <p className="mt-1 text-xs text-cream/60">Stored on this device — sign in to sync presets.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {recentTools.map((t) =>
              t ? (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="rounded-full border border-gold/30 px-3 py-1 text-sm text-gold hover:bg-gold/10"
                  >
                    {t.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-heading text-xl text-gold">
          {query ? `Results (${filtered.length})` : "All tools"}
        </h2>
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const Icon = (Icons as Record<string, Icons.LucideIcon>)[t.icon] ?? Icons.Wrench;
            return (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 transition hover:border-gold/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-heading text-lg text-gold">{t.name}</p>
                  <p className="mt-2 flex-1 text-sm text-cream/75">{t.description}</p>
                  <span className="mt-3 text-xs uppercase tracking-widest text-goldBody">{t.category}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-cream/70">No tools match your search.</p>
        ) : null}
      </section>
    </div>
  );
}
