import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/backend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Uses CSS vars injected by next/font in layout.tsx
        display: ["var(--font-bebas)", "sans-serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background:      "#0A0A0A",
        surface:         "#111111",
        card:            "#161616",
        "card-raised":   "#1C1C1C",
        foreground:      "#F0F0F0",
        "muted-fg":      "#666666",
        subtle:          "#333333",
        border:          "#222222",
        "border-strong": "#333333",
        volt: {
          DEFAULT: "#C8FF00",
          dim:     "rgba(200,255,0,0.10)",
          glow:    "rgba(200,255,0,0.30)",
        },
        "red-brand": "#FF2020",
      },
      borderRadius: {
        none:    "0px",
        sm:      "2px",
        DEFAULT: "2px",
        md:      "4px",
        lg:      "4px",
        xl:      "6px",
        "2xl":   "8px",
        full:    "9999px",
      },
      animation: {
        "fade-up":    "fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        "volt-pulse": "volt-pulse 2s ease-in-out infinite",
        marquee:      "marquee 22s linear infinite",
        shimmer:      "shimmer 1.4s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "volt-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,255,0,0.30)" },
          "50%":       { boxShadow: "0 0 20px 6px rgba(200,255,0,0.30)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to:   { backgroundPosition: "200% center" },
        },
      },
      boxShadow: {
        volt:      "0 0 20px rgba(200,255,0,0.30)",
        "volt-sm": "0 0 8px rgba(200,255,0,0.20)",
        "red":     "0 0 20px rgba(255,32,32,0.30)",
        dark:      "0 4px 24px rgba(0,0,0,0.6)",
        "dark-lg": "0 12px 48px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
