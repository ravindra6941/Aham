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
          saffron: "#FF6600",
          gold: "#DAA520",
          agni: "#8B0000",
          night: "#0A0A2E",
          dawn: "#2D1B69",
          flame: "#FF4500",
          ash: "#2C2C2C",
          parchment: "#F5E6C8",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        sacred: ["'Cormorant Garamond'", "serif"],
        devanagari: ["'Noto Serif Devanagari'", "serif"],
      },
      animation: {
        "flame-flicker": "flicker 3s ease-in-out infinite alternate",
        "slow-spin": "spin 60s linear infinite",
        "pulse-sacred": "pulseSacred 4s ease-in-out infinite",
        "fade-in": "fadeIn 2s ease-out forwards",
        "fade-in-slow": "fadeIn 4s ease-out forwards",
        "breathe": "breathe 6s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "25%": { opacity: "0.85", transform: "scale(0.98) rotate(-1deg)" },
          "50%": { opacity: "0.95", transform: "scale(1.02) rotate(0.5deg)" },
          "75%": { opacity: "0.9", transform: "scale(0.99) rotate(-0.5deg)" },
        },
        pulseSacred: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 102, 0, 0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(255, 102, 0, 0.6)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(218, 165, 32, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(218, 165, 32, 0.5)" },
        },
      },
      backgroundImage: {
        "sacred-gradient": "radial-gradient(ellipse at center, #2D1B69 0%, #0A0A2E 50%, #000000 100%)",
        "fire-gradient": "linear-gradient(180deg, #FF4500 0%, #FF6600 30%, #DAA520 70%, transparent 100%)",
        "dawn-gradient": "linear-gradient(180deg, #0A0A2E 0%, #2D1B69 40%, #FF6600 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
