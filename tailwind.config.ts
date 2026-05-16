import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#c5af71",
          cream: "#e6e4d1",
          teal: "#a1b3b1",
          charcoal: "#35383b",
          olive: "#554e3c",
        },
        surface: {
          DEFAULT: "#e6e4d1",
          50: "#f5f4ec",
          100: "#e6e4d1",
          200: "#d4d1b8",
          300: "#bfbb9a",
          700: "#554e3c",
          800: "#35383b",
          900: "#2a2d2f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        "soft": "0 2px 12px rgba(53, 56, 59, 0.06)",
        "soft-md": "0 4px 20px rgba(53, 56, 59, 0.08)",
        "soft-lg": "0 8px 32px rgba(53, 56, 59, 0.10)",
        "glow": "0 0 20px rgba(197, 175, 113, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
