import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        vedic: {
          saffron: "#E8720C",
          gold: "#C4993B",
          agni: "#6B1010",
          night: "#060612",
          dawn: "#1A0F3A",
          flame: "#D94E1F",
          ash: "#1A1A1A",
          parchment: "#E8DCC8",
          ember: "#FF8C42",
          void: "#020204",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        sacred: ["'Cormorant Garamond'", "serif"],
        devanagari: ["'Noto Serif Devanagari'", "serif"],
      },
      fontSize: {
        "display": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "heading": ["clamp(1.75rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "subheading": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.3" }],
      },
      animation: {
        "flame-flicker": "flicker 3s ease-in-out infinite alternate",
        "slow-spin": "spin 120s linear infinite",
        "pulse-sacred": "pulseSacred 4s ease-in-out infinite",
        "fade-in": "fadeIn 1.5s ease-out forwards",
        "fade-up": "fadeUp 1s ease-out forwards",
        "breathe": "breathe 8s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite alternate",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "ripple": "ripple 2s ease-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "25%": { opacity: "0.85", transform: "scale(0.98) rotate(-0.5deg)" },
          "50%": { opacity: "0.95", transform: "scale(1.01)" },
          "75%": { opacity: "0.9", transform: "scale(0.99) rotate(0.5deg)" },
        },
        pulseSacred: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 114, 12, 0.15)" },
          "50%": { boxShadow: "0 0 60px rgba(232, 114, 12, 0.35)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.03)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(196, 153, 59, 0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(196, 153, 59, 0.25)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      backgroundImage: {
        "sacred-gradient": "radial-gradient(ellipse at center, #1A0F3A 0%, #060612 50%, #020204 100%)",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },
      transitionTimingFunction: {
        "sacred": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
