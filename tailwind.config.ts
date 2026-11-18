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
        display:  ["var(--font-display)", "sans-serif"],
        sans:     ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:     ["var(--font-mono)", "monospace"],
        graffiti: ["var(--font-mono)", "monospace"],
      },
      colors: {
        background:      "#0A0A0A",
        surface:         "#121212",
        card:            "#161616",
        "card-raised":   "#1C1C1C",
        foreground:      "#EAEAEA",
        "muted-fg":      "#7A7A7A",
        subtle:          "#2A2A2A",
        border:          "#262626",
        "border-strong": "#404040",
        // Single uncompromising Industrial Hazard Red accent
        volt: {
          DEFAULT: "#E61919",
          dim:     "rgba(230,25,25,0.12)",
          glow:    "rgba(230,25,25,0.25)",
        },
        terminal: "#4AF626",
        "red-brand": "#E61919",
      },
      borderRadius: {
        none:    "0px",
        sm:      "0px",
        DEFAULT: "0px",
        md:      "0px",
        lg:      "0px",
        xl:      "0px",
        "2xl":   "0px",
        full:    "0px",
      },
      animation: {
        "fade-up": "fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee:   "marquee 24s linear infinite",
        shimmer:   "shimmer 1.4s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
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
        none:    "none",
        volt:    "none",
        "volt-sm": "none",
        dark:    "none",
        "dark-lg": "none",
      },
    },
  },
  plugins: [],
};

export default config;
