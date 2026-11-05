import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF6",
        ink: "#18181B",
        coal: "#09090B",
        muted: "#71717A",
        line: "#E4E4E7",
        soft: "#F4F4F5",
        ok: { DEFAULT: "#15803D", bg: "#EAF4EC", line: "#BBDDC4" },
        warn: { DEFAULT: "#F59E0B", text: "#E8930C", bg: "#FEF1D9" },
        info: { DEFAULT: "#3B82F6", bg: "#EFF6FF", line: "#3B82F6" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "1280px" },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        slide: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(320%)" } },
      },
      animation: { rise: "rise .3s ease-out both", slide: "slide 1.4s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
