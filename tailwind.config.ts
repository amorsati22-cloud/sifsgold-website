import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#04101E", dark: "#06080F", light: "#0A1929" },
        gold: { DEFAULT: "#D4A843", light: "#F0C060", muted: "#A07830" },
        teal: { DEFAULT: "#06D4BA", light: "#3EECD4", dark: "#04A08C" },
        white: "#FFFFFF",
        offwhite: "#F5F4F0",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Montserrat", "-apple-system", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
