"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stream = {
  id: string;
  title: string;
  category: string;
  status: string;
  thumbnail_url: string | null;
  recording_url: string | null;
  profiles?: { full_name?: string };
};

export function LiveIndexClient() {
  const [live, setLive] = useState<Stream[]>([]);
  const [upcoming, setUpcoming] = useState<Stream[]>([]);
  const [past, setPast] = useState<Stream[]>([]);

  useEffect(() => {
    void fetch("/api/streams?status=live").then((r) => r.json()).then((d) => setLive(d.streams ?? []));
    void fetch("/api/streams?status=scheduled").then((r) => r.json()).then((d) => setUpcoming(d.streams ?? []));
    void fetch("/api/streams?status=ended").then((r) => r.json()).then((d) => setPast(d.streams ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-navy text-cream">
      <header className="border-b border-gold/20 px-4 py-12">
        <h1 className="font-heading text-4xl text-gold">Live</h1>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 p-8">
        <Section title="Live now" items={live} live />
        <Section title="Upcoming" items={upcoming} />
        <Section title="Recordings" items={past} />
      </main>
    </div>
  );
}

function Section({ title, items, live: isLive }: { title: string; items: Stream[]; live?: boolean }) {
  if (!items.length) return <p className="text-sm text-cream/60">None</p>;
  return (
    <section>
      <h2 className="text-xl text-gold">{title}</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.id}>
            <Link href={`/live/${s.id}`} className="block rounded-lg border border-gold/20 p-4 hover:border-gold">
              {isLive ? <span className="text-xs text-red-400">LIVE</span> : null}
              <p className="font-semibold">{s.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
