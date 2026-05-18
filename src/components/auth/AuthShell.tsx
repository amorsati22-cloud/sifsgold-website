"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  const { colors } = useTheme();

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-16 md:py-24">
      <div
        className="absolute left-0 right-0 top-0 z-10 h-px"
        style={{ background: `linear-gradient(90deg, ${colors.gold}, ${colors.teal})` }}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl border p-8 shadow-xl backdrop-blur-md sm:p-10"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            backgroundColor: `${colors.navyDeep}B3`,
          }}
        >
          <h1
            className="text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: colors.cream }}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-center text-sm leading-relaxed" style={{ color: `${colors.cream}B3` }}>
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
