import type { Config } from "tailwindcss";

function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--color-primary"),
        "on-primary": withOpacity("--color-on-primary"),
        secondary: withOpacity("--color-secondary"),
        accent: withOpacity("--color-accent"),
        cta: withOpacity("--color-cta"),
        background: withOpacity("--color-background"),
        foreground: withOpacity("--color-foreground"),
        muted: withOpacity("--color-muted"),
        border: withOpacity("--color-border"),
        destructive: withOpacity("--color-destructive"),
        ring: withOpacity("--color-ring"),
        gold: withOpacity("--color-gold"),
        navy: withOpacity("--color-navy"),
      },
      fontFamily: {
        serif: ["var(--font-heading)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        "6xl": "72rem",
        "7xl": "80rem",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
