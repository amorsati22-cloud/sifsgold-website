"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ToastItem = {
  id: string;
  title: string;
  body?: string;
  action_url?: string;
};

export function NotificationToast({ userId }: { userId: string }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const dismiss = useCallback(() => setToast(null), []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => setToast(payload.new as ToastItem),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [toast, dismiss]);

  if (!toast) return null;

  const content = (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[200] max-w-sm rounded-brand-lg border border-gold/40 bg-navy-deep p-4 pr-10 shadow-lg"
    >
      <p className="font-semibold text-gold">{toast.title}</p>
      {toast.body ? <p className="mt-1 text-sm text-cream/80">{toast.body}</p> : null}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dismiss();
        }}
        className="absolute right-2 top-2 text-cream/50 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );

  if (toast.action_url) {
    return (
      <Link
        href={toast.action_url}
        onClick={dismiss}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {content}
      </Link>
    );
  }

  return content;
}
