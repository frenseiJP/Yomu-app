import type { Config } from "tailwindcss";

/** 和モダン × ミニマリズム — 日本の伝統色パレット */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 日本の伝統色
        wa: {
          akane: "#b94047",       // 茜色
          ruri: "#2a5caa",        // 瑠璃色
          sumi: "#1e1e1e",        // 墨
          hai: "#6b6b6b",         // 灰
          kinari: "#f4e4bc",      // 生成り
          wakaba: "#98d98e",      // 若葉
          asagi: "#48929b",       // 浅葱
          botan: "#b94047",       // 牡丹（アクセント）
        },
        yomu: {
          bg: "#020617",
          glass: "rgb(15 23 42 / 0.6)",
          glassBorder: "rgb(148 163 184 / 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-shippori)", "Georgia", "serif"],
      },
      backgroundImage: {
        "glass-dark": "linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(2,6,23,0.5) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.24)",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.32)",
      },
      animation: {
        "hover-spread": "hover-spread 0.4s ease-out forwards",
      },
      keyframes: {
        "hover-spread": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
