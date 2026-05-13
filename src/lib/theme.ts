/**
 * Single source of truth for brand tokens. Tailwind reads these values via tailwind.config.
 * ThemeProvider exposes the same object for programmatic use (useTheme).
 */

export const sifsGoldTheme = {
  colors: {
    navy: "#04101E",
    navyDeep: "#06080F",
    /** Slightly lifted navy for cards and section bands (UI only). */
    navyLift: "#0A1929",
    teal: "#00C9B1",
    gold: "#D4A843",
    goldLight: "#F0C060",
    cream: "#F5EFE0",
    whiteSoft: "#FAFAF7",
    overlay: "rgba(4, 16, 30, 0.85)",
  },
  fonts: {
    headline: "var(--font-playfair)",
    body: "var(--font-montserrat)",
    mono: "var(--font-space-mono)",
  },
  radii: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    full: "999px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
    xxl: "64px",
    xxxl: "96px",
  },
  motion: {
    fast: "180ms",
    medium: "320ms",
    slow: "500ms",
  },
} as const;

export type SifsGoldTheme = typeof sifsGoldTheme;
