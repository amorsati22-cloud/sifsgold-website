"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  action_url: string | null;
  read: boolean;
  category: string;
  created_at: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications?limit=5");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.notifications ?? []);
    setUnread(data.unread_count ?? 0);
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function markRead(id: string) {
    await fetch("/api/notifications/" + id + "/read", { method: "PATCH" });
    void load();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-brand-md border border-gold/25 p-2 text-cream hover:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={"Notifications" + (unread ? ", " + unread + " unread" : "")}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-brand-lg border border-gold/30 bg-navy-deep shadow-xl" role="dialog" aria-label="Recent notifications">
          <ul className="max-h-80 overflow-y-auto divide-y divide-gold/10">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-cream/60">No notifications yet</li>
            ) : (
              items.map((n) => (
                <li key={n.id}>
                  {n.action_url ? (
                    <Link
                      href={n.action_url}
                      onClick={() => void markRead(n.id)}
                      className="block px-4 py-3 hover:bg-gold/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                    >
                      <p className="text-sm font-medium text-cream">{n.title}</p>
                      {n.body ? <p className="mt-0.5 text-xs text-cream/60 line-clamp-2">{n.body}</p> : null}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void markRead(n.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gold/5"
                    >
                      <p className="text-sm font-medium text-cream">{n.title}</p>
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-gold/15 p-2">
            <Link href="/dashboard/notifications" className="block rounded-brand-md px-3 py-2 text-center text-sm text-gold hover:bg-gold/10">
              View all
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
