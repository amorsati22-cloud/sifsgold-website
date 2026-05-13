"use client";

import { createContext, useContext, type ReactNode } from "react";
import { sifsGoldTheme, type SifsGoldTheme } from "@/lib/theme";

const ThemeContext = createContext<SifsGoldTheme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={sifsGoldTheme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): SifsGoldTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
