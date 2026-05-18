"use client";

import { useCallback, useEffect, useState } from "react";
import { EMAIL_TEMPLATE_TYPES, type EmailTemplateType } from "@/lib/email/types";

const TEMPLATE_LABELS: Record<EmailTemplateType, string> = {
  welcome_sifs_circle: "Welcome to Sif's Circle",
  founding_member_welcome: "Founding Member Welcome",
  sifs_advocate_application_received: "Sif's Advocate — Application Received",
  sifs_advocate_acceptance: "Sif's Advocate — Acceptance",
  contact_form_confirmation: "Contact Form Confirmation",
  data_deletion_request_received: "Data Deletion Request",
  dmca_takedown_received: "DMCA Takedown Received",
  launch_day_announcement: "Launch Day Announcement",
  sifs_advocate_rejection: "Sif's Advocate — Application Update",
};

export function EmailPreview() {
  const [template, setTemplate] = useState<EmailTemplateType>("welcome_sifs_circle");
  const [html, setHtml] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadPreview = useCallback(async (type: EmailTemplateType) => {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`/api/email/view?template=${encodeURIComponent(type)}`);
      const text = await res.text();
      if (!res.ok) {
        setStatus(text || "Preview failed");
        setHtml("");
        return;
      }
      setHtml(text);
    } catch {
      setStatus("Could not load preview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPreview(template);
  }, [template, loadPreview]);

  async function sendTest() {
    if (!testEmail.trim()) {
      setStatus("Enter an email address to send a test.");
      return;
    }
    setStatus("Sending…");
    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: template, to: testEmail.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; skipped?: boolean };
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Send failed. Is RESEND_API_KEY set?");
        return;
      }
      setStatus(data.skipped ? "Skipped (marketing opt-out)." : `Sent to ${testEmail.trim()}.`);
    } catch {
      setStatus("Send failed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-cream">Email template preview</h1>
      <p className="mt-2 font-body text-sm text-cream/70">
        Development only. Renders React Email templates and can send tests when{" "}
        <code className="text-gold-body">RESEND_API_KEY</code> is configured.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="template-select" className="font-mono text-xs uppercase tracking-wider text-gold-body">
            Template
          </label>
          <select
            id="template-select"
            value={template}
            onChange={(e) => setTemplate(e.target.value as EmailTemplateType)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-navy-deep/60 px-4 py-3 font-body text-cream focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
          >
            {EMAIL_TEMPLATE_TYPES.map((type) => (
              <option key={type} value={type}>
                {TEMPLATE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="test-email" className="font-mono text-xs uppercase tracking-wider text-gold-body">
            Send test to
          </label>
          <input
            id="test-email"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-white/20 bg-navy-deep/60 px-4 py-3 font-body text-cream placeholder:text-cream/40 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
          />
        </div>

        <button
          type="button"
          onClick={sendTest}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gold px-6 font-body text-sm font-semibold text-navy hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
        >
          Send to my email
        </button>
      </div>

      {status ? (
        <p className="mt-4 font-body text-sm text-teal" role="status">
          {status}
        </p>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white">
        {loading ? (
          <p className="p-8 font-body text-navy">Loading preview…</p>
        ) : (
          <iframe
            title={`Email preview: ${TEMPLATE_LABELS[template]}`}
            srcDoc={html}
            className="h-[min(80vh,900px)] w-full border-0"
            sandbox="allow-same-origin"
          />
        )}
      </div>
      </div>
  );
}
