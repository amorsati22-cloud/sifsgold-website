import type { Config } from "tailwindcss";
import { sifsGoldTheme as t } from "./src/lib/theme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: t.colors.navy,
          deep: t.colors.navyDeep,
          light: t.colors.navyLift,
        },
        "navy-dark": t.colors.navyDeep,
        teal: t.colors.teal,
        gold: {
          DEFAULT: t.colors.gold,
          body: t.colors.goldBody,
          light: t.colors.goldLight,
        },
        cream: t.colors.cream,
        "white-soft": t.colors.whiteSoft,
        overlay: t.colors.overlay,
        offwhite: t.colors.cream,
      },
      fontFamily: {
        heading: [t.fonts.headline, "Georgia", "serif"],
        body: [t.fonts.body, "system-ui", "sans-serif"],
        mono: [t.fonts.mono, "ui-monospace", "monospace"],
      },
      spacing: {
        "brand-xs": t.spacing.xs,
        "brand-sm": t.spacing.sm,
        "brand-md": t.spacing.md,
        "brand-lg": t.spacing.lg,
        "brand-xl": t.spacing.xl,
        "brand-xxl": t.spacing.xxl,
        "brand-xxxl": t.spacing.xxxl,
      },
      borderRadius: {
        "brand-sm": t.radii.sm,
        "brand-md": t.radii.md,
        "brand-lg": t.radii.lg,
        "brand-full": t.radii.full,
      },
      transitionDuration: {
        "brand-fast": t.motion.fast,
        "brand-medium": t.motion.medium,
        "brand-slow": t.motion.slow,
      },
      maxWidth: {
        content: "1280px",
      },
      boxShadow: {
        nav: "0 20px 60px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
