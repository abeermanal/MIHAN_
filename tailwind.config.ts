import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          strong: "var(--muted-strong)",
        },
        teal: {
          50: "#E6F5F5",
          100: "#B3E0E0",
          200: "#80CCCC",
          300: "#4DB8B8",
          400: "#26A8A8",
          500: "#1A8A8A",
          600: "#147070",
          700: "#0D5555",
          800: "#0D2B2B",
          900: "#0A1F1F",
          950: "#071515",
        },
        gold: {
          50: "#FBF6E8",
          100: "#F3E8C5",
          200: "#E8D69E",
          300: "#DDCA82",
          400: "#D4B36A",
          500: "#C9A84C",
          600: "#B8963E",
          700: "#9A7D34",
          800: "#7C642A",
          900: "#5E4B20",
          950: "#3F3216",
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#4CAF87",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        warning: {
          50: "#FEF9E7",
          100: "#FDF0C4",
          200: "#FCE49D",
          300: "#FBD676",
          400: "#F9C94F",
          500: "#E5B85C",
          600: "#C9A040",
          700: "#A88330",
          800: "#876620",
          900: "#664A10",
        },
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "Cairo",
          "Segoe UI",
          "Tahoma",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        soft: "var(--shadow-soft)",
        glow: "0 0 28px -4px rgba(201, 168, 76, 0.25)",
        "glow-teal": "0 0 28px -4px rgba(26, 138, 138, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
        "teal-gradient": "linear-gradient(135deg, #0D5555, #0D2B2B)",
        "pattern-grid": "linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "32px 32px",
      },
    },
  },
  plugins: [],
};
export default config;
