import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
      },
      fontFamily: {
        serif: "var(--playfair-display-font)",
        mono: "var(--dmono-font)",
      },
      boxShadow: {
        custom: "4px 4px 0 var(--primary)",
      },
    },
  },
  plugins: [],
};

export default config;
