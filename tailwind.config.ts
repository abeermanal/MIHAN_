import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#f6f2fb",
          100: "#ede4f7",
          200: "#dcc9ef",
          300: "#c3a3e0",
          400: "#a678cd",
          500: "#8b52b8",
          600: "#7a3fa3",
          700: "#663385",
          800: "#552d6d",
          900: "#47265a",
          950: "#2e1440",
        },
        gold: {
          50: "#fdf9ec",
          100: "#faf0cd",
          200: "#f4de99",
          300: "#eec661",
          400: "#eab037",
          500: "#e19c22",
          600: "#c47b19",
          700: "#a25a19",
          800: "#85471c",
          900: "#6e3b1c",
          950: "#401e0c",
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
        card: "0 4px 20px -2px rgba(85, 45, 109, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
