"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["❤️", "🔥", "👏", "✨", "💛"];

export function FloatingReactions({ burst }: { burst: number }) {
  const [items, setItems] = useState<{ id: number; emoji: string; left: number }[]>([]);

  useEffect(() => {
    if (!burst) return;
    const id = Date.now();
    setItems((prev) => [
      ...prev,
      { id, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], left: 10 + Math.random() * 80 },
    ]);
    const t = setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 2500);
    return () => clearTimeout(t);
  }, [burst]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute bottom-8 animate-bounce text-2xl motion-reduce:animate-none"
          style={{ left: `${item.left}%` }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
