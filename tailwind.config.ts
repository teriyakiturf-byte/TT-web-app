import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Approved 4px base spacing system (#16) — use these tokens for all
      // padding / margin / gap. Do NOT introduce arbitrary [Xpx] values
      // (e.g. p-[18px], gap-[14px], mt-[28px]) for spacing.
      //   0 → 0     1 → 4px    2 → 8px    3 → 12px   4 → 16px   5 → 20px
      //   6 → 24px  8 → 32px   10 → 40px  12 → 48px  16 → 64px
      // Conventions: mobile page padding px-4 py-6 · card padding p-4 ·
      // card list gaps gap-3 · section heading margin-bottom mb-4.
      spacing: {
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
      },
      colors: {
        // Field Console palette.
        forest:        "#1B4332",
        "forest-deep": "#0f2a1f",
        "forest-mid":  "#13261d",
        panel:         "#1b3327",
        "panel-lite":  "#223d2f",
        lime:          "#52B788",
        "lime-soft":   "#95D5B2",
        orange:        "#F4631E",
        "orange-tt":   "#F4631E",
        cream:         "#F5F1E8",
        charcoal:      "#2C3E50",
        "amber-tt":    "#E09B1A",
        // Legacy aliases kept so existing guest-page utility classes resolve.
        "lime-light":  "#D8F3DC",
        "orange-light": "#FFF0EB",
        muted:         "#6B7B70",
        border:        "#D6E8DC",
      },
      fontFamily: {
        display:    ["'Bebas Neue'", "sans-serif"],
        body:       ["'DM Sans'", "sans-serif"],
        mono:       ["'DM Mono'", "monospace"],
        bebas:      ["'Bebas Neue'", "sans-serif"],
        montserrat: ["'Montserrat'", "sans-serif"],
        dm:         ["'DM Sans'", "sans-serif"],
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
