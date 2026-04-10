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
        forest:       "#1B4332",
        lime:         "#52B788",
        "lime-light": "#D8F3DC",
        orange:       "#F4631E",
        "orange-light": "#FFF0EB",
        cream:        "#F8F4E9",
        charcoal:     "#1C2B1E",
        muted:        "#6B7B70",
        border:       "#D6E8DC",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      fontSize: {
        "stat": ["3rem", { lineHeight: "1" }],
        "hero": ["2.75rem", { lineHeight: "1.05" }],
      },
    },
  },
  plugins: [],
};
export default config;
