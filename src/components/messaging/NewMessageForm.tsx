"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ContactOption } from "@/types/messaging";

export function NewMessageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("to");
  const appointmentId = searchParams.get("appointment");

  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [selected, setSelected] = useState<string[]>(preselected ? [preselected] : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/messages/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(data.contacts ?? []));
  }, []);

  async function startChat() {
    if (selected.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant_ids: selected,
        thread_type: appointmentId ? "appointment" : selected.length > 1 ? "group" : "dm",
        linked_appointment_id: appointmentId,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.thread_id) {
      router.push(`/dashboard/messages/${data.thread_id}`);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="space-y-6">
      {appointmentId ? (
        <p className="rounded-brand-lg border border-gold/20 bg-gold/10 px-4 py-3 font-body text-sm text-cream">
          This conversation will be linked to your appointment.
        </p>
      ) : null}

      <ul className="max-h-96 space-y-2 overflow-y-auto rounded-brand-lg border border-gold/15">
        {contacts.map((c) => (
          <li key={c.user_id}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-white/5">
              <input
                type="checkbox"
                checked={selected.includes(c.user_id)}
                onChange={() => toggle(c.user_id)}
                className="rounded border-gold/30 text-gold focus:ring-gold"
              />
              <div>
                <p className="font-body text-cream">{c.display_name}</p>
                {c.subtitle ? (
                  <p className="font-body text-xs text-gold-body">{c.subtitle}</p>
                ) : null}
              </div>
            </label>
          </li>
        ))}
      </ul>

      {contacts.length === 0 ? (
        <p className="font-body text-sm text-gold-body">
          Book or complete an appointment to message someone on Sif&apos;s Gold.
        </p>
      ) : null}

      <div className="flex gap-3">
        <GoldButton label="Cancel" href="/dashboard/messages" variant="outlined" size="md" />
        <GoldButton
          label={loading ? "Starting…" : "Start conversation"}
          onClick={() => void startChat()}
          variant="solid"
          size="md"
          className={selected.length === 0 || loading ? "pointer-events-none opacity-60" : ""}
        />
      </div>
    </div>
  );
}
