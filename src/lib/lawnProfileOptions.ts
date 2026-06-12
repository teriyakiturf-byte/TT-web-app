import type { GrassType } from "@/types";

// Shared lawn-profile option data used by both the onboarding wizard and the
// Settings page, so the radio cards and grass photo quiz stay in sync.

// Photo-quiz grass choices. "mixed" is a UI-only value: it resolves to
// "tall-fescue" for plan generation (the most common KC grass), since the
// rest of the app/API speaks the canonical GrassType vocabulary.
export type GrassChoice = "tall-fescue" | "kentucky-bluegrass" | "zoysia" | "mixed";

export interface GrassQuizOption {
  value: GrassChoice;
  label: string;
  desc: string;
  subNote?: string;
  image: string;
  placeholderBg: string;
  isPlaceholderQuestion?: boolean;
}

export const GRASS_QUIZ: GrassQuizOption[] = [
  {
    value: "tall-fescue",
    label: "Tall Fescue",
    desc: "Broad, dark green blades. Stays green in KC winters.",
    subNote: "Most common in Johnson County",
    image: "/images/grass/tall-fescue.jpg",
    placeholderBg: "#2D6A4F",
  },
  {
    value: "kentucky-bluegrass",
    label: "Kentucky Bluegrass",
    desc: "Fine, boat-shaped blades. Bright green. Goes tan in summer heat.",
    image: "/images/grass/kentucky-bluegrass.jpg",
    placeholderBg: "#1B4332",
  },
  {
    value: "zoysia",
    label: "Zoysia",
    desc: "Dense, carpet-like. Turns tan in fall. Slow to green up in spring.",
    image: "/images/grass/zoysia.jpg",
    placeholderBg: "#74C69D",
  },
  {
    value: "mixed",
    label: "Not Sure",
    desc: "No problem — we will build your plan around the most common KC grass.",
    image: "/images/grass/mixed.jpg",
    placeholderBg: "#95D5B2",
    isPlaceholderQuestion: true,
  },
];

// "mixed" / "Not Sure" maps to tall-fescue for plan generation; the other
// quiz values are already canonical GrassType values.
export function resolveGrassType(choice: GrassChoice): GrassType {
  return choice === "mixed" ? "tall-fescue" : choice;
}

// Re-highlight the matching card for returning users from a saved value.
export function savedGrassToChoice(saved: string): GrassChoice | null {
  if (
    saved === "tall-fescue" ||
    saved === "kentucky-bluegrass" ||
    saved === "zoysia"
  ) {
    return saved;
  }
  if (saved === "mixed" || saved === "mixed-unsure") return "mixed";
  return null;
}

export type LawnSize = "small" | "medium" | "large" | "xl";

export interface SizeOption {
  value: LawnSize;
  label: string;
  range: string;
  hint: string;
  sqft: number;
}

export const SIZE_OPTIONS: SizeOption[] = [
  { value: "small",  label: "Small",  range: "Under 3,000 sq ft",   hint: "(about the size of a 2-car garage x3)", sqft: 2000 },
  { value: "medium", label: "Medium", range: "3,000–7,000 sq ft",   hint: "(most Johnson County lots)",           sqft: 5000 },
  { value: "large",  label: "Large",  range: "7,000–12,000 sq ft",  hint: "(corner lots, newer builds)",          sqft: 9500 },
  { value: "xl",     label: "XL",     range: "Over 12,000 sq ft",   hint: "(acreage, rural, large suburban)",     sqft: 15000 },
];

// Map a measured/saved sqft value back to the closest radio bucket so returning
// users (and map measurements) keep a selection highlighted.
export function sqftToSize(n: number): LawnSize {
  if (n < 3000) return "small";
  if (n <= 7000) return "medium";
  if (n <= 12000) return "large";
  return "xl";
}
