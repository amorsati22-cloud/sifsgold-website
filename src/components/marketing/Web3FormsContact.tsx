"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Web3FormsContactProps = {
  accessKey: string;
  subject: string;
  children: ReactNode;
};

export function Web3FormsContact({ accessKey, subject, children }: Web3FormsContactProps) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body: Record<string, string> = {
      access_key: accessKey,
      subject,
    };

    for (const [key, val] of fd.entries()) {
      if (typeof val !== "string") continue;
      const t = val.trim();
      if (!t) continue;
      body[key] = t;
    }

    if (!body.name) return;

    setPending(true);
    setStatus("idle");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { success?: boolean };
      if (res.ok && data.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  const fieldsDisabled = pending || status === "ok";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={fieldsDisabled} className="space-y-4 [&:disabled]:opacity-60">
        {children}
      </fieldset>
      {status === "ok" ? (
        <p
          className="rounded-xl border border-gold/40 bg-navy-light/80 px-4 py-3 text-sm font-medium text-gold"
          role="status"
        >
          Thanks — we received your message.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending || status === "ok"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gold px-6 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
