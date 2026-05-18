"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { verifyHealthReauth } from "@/lib/health-hub/actions";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import { HEALTH_DISCLAIMER_SHORT } from "@/lib/health-hub/constants";

export function ReauthGate({
  children,
  needsReauth,
}: {
  children: ReactNode;
  needsReauth: boolean;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!needsReauth) {
    return <>{children}</>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await verifyHealthReauth(password);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div
      className="mx-auto max-w-md rounded-brand-lg border border-gold/20 p-6 md:p-8"
      style={{ backgroundColor: theme.colors.navyDeep }}
      role="dialog"
      aria-labelledby="reauth-title"
      aria-describedby="reauth-desc"
    >
      <h2 id="reauth-title" className="font-heading text-xl font-bold text-gold">
        Confirm it&apos;s you
      </h2>
      <p id="reauth-desc" className="mt-2 font-body text-sm text-cream/80">
        Re-enter your password to view sensitive Health Hub data. This is the web equivalent of
        biometric unlock on mobile — your health data is never stored in the browser.
      </p>
      <p className="mt-3 font-body text-xs text-goldBody">{HEALTH_DISCLAIMER_SHORT}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="health-reauth-password" className="mb-1 block font-body text-sm text-cream">
            Password
          </label>
          <GlassInput
            id="health-reauth-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
          {error ? (
            <p className="mt-2 font-body text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <GoldButton
          label={pending ? "Verifying…" : "Unlock Health Hub"}
          type="submit"
          variant="solid"
          className="w-full"
        />
      </form>
    </div>
  );
}
