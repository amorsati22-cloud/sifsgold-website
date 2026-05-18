"use client";

import { measurePasswordStrength } from "@/lib/auth/password-strength";
import { useTheme } from "@/components/theme/ThemeProvider";

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { colors } = useTheme();
  const strength = measurePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={strength.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Password strength: ${strength.label}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{
            width: `${strength.percent}%`,
            backgroundColor:
              strength.score <= 1 ? colors.teal : strength.score <= 2 ? colors.goldBody : colors.gold,
          }}
        />
      </div>
      <p className="mt-1 text-xs" style={{ color: `${colors.cream}99` }}>
        {strength.label}
      </p>
    </div>
  );
}
