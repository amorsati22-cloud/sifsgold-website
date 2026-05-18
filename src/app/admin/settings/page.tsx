import { ADMIN_EMAILS } from "@/lib/admin/allowlist";
import { logAdminAudit } from "@/lib/admin/audit";
import { requireAdminPage } from "@/lib/admin/auth";
import { isResendConfigured } from "@/lib/email/resend-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sifsGoldTheme } from "@/lib/theme";

export default async function AdminSettingsPage() {
  const { admin, email } = await requireAdminPage();

  await logAdminAudit({
    admin,
    adminEmail: email,
    action: "viewed_admin_settings",
  });

  const { count: auditCount } = await admin
    .from("admin_audit_log")
    .select("id", { count: "exact", head: true });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gold">Settings</h1>
      <p className="mt-2 font-body text-cream/80">Brand kit reference, allowlist, and integration health.</p>

      <section className="mt-10 rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-6">
        <h2 className="font-heading text-lg text-gold">Brand kit</h2>
        <ul className="mt-4 space-y-2 font-body text-sm text-cream/85">
          <li>
            Navy: <span className="font-mono text-gold">{sifsGoldTheme.colors.navy}</span>
          </li>
          <li>
            Gold: <span className="font-mono text-gold">{sifsGoldTheme.colors.gold}</span>
          </li>
          <li>
            Teal: <span className="font-mono text-gold">{sifsGoldTheme.colors.teal}</span>
          </li>
          <li>
            Cream: <span className="font-mono text-gold">{sifsGoldTheme.colors.cream}</span>
          </li>
          <li>Headlines: Playfair Display · Body: Montserrat</li>
          <li>
            <a href="/brand" className="text-gold underline">
              Brand guidelines
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-6">
        <h2 className="font-heading text-lg text-gold">Admin allowlist (read-only)</h2>
        <p className="mt-2 text-sm text-cream/70">Changes require a code deploy for security.</p>
        <ul className="mt-4 list-inside list-disc text-sm text-cream/90">
          {ADMIN_EMAILS.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-brand-lg border border-gold/20 bg-navy-deep/60 p-6">
        <h2 className="font-heading text-lg text-gold">System status</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <StatusRow label="Supabase" ok={isSupabaseConfigured()} />
          <StatusRow label="Resend" ok={isResendConfigured()} />
          <StatusRow
            label="Web3Forms webhook secret"
            ok={Boolean(process.env.WEB3FORMS_WEBHOOK_SECRET?.trim())}
          />
          <StatusRow label="Stripe secret" ok={Boolean(process.env.STRIPE_SECRET_KEY?.trim())} />
        </ul>
        <p className="mt-4 text-xs text-cream/55">Audit log entries: {auditCount ?? 0}</p>
      </section>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-cream/85">{label}</span>
      <span className={ok ? "text-teal" : "text-gold-body"}>{ok ? "Configured" : "Not configured"}</span>
    </li>
  );
}
