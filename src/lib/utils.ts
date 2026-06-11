/**
 * Display formatting helpers.
 */

/**
 * Convert a kebab-case grass type value (as stored in the database) into a
 * human-readable Title Case label for display in the UI.
 *
 * Known values are mapped explicitly so we control the exact wording (e.g.
 * "mixed" → "Mixed / Not Sure"). Any unknown value falls back to a generic
 * kebab-case → Title Case conversion so nothing renders as raw kebab-case.
 *
 * This only affects display — database values are never changed.
 */
const GRASS_TYPE_LABELS: Record<string, string> = {
  "tall-fescue": "Tall Fescue",
  "kentucky-bluegrass": "Kentucky Bluegrass",
  "perennial-ryegrass": "Perennial Ryegrass",
  "zoysia": "Zoysia",
  "bermuda": "Bermuda",
  "fine-fescue": "Fine Fescue",
  "buffalo-grass": "Buffalo Grass",
  "mixed": "Mixed / Not Sure",
  "mixed-unsure": "Mixed / Not Sure",
};

export function formatGrassType(value: string): string {
  if (!value) return "";

  // Normalize: lowercase and treat snake_case the same as kebab-case.
  const normalized = value.trim().toLowerCase().replace(/_/g, "-");

  if (GRASS_TYPE_LABELS[normalized]) {
    return GRASS_TYPE_LABELS[normalized];
  }

  // Fallback: kebab-case → Title Case.
  return normalized
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Map a KC-metro ZIP code to its city name for personalized plan headers.
 *
 * Only the 5-digit ZIP prefix is considered. Any ZIP we don't explicitly
 * recognize falls back to the generic "Kansas City" so the header always
 * reads naturally.
 */
const ZIP_TO_CITY: Record<string, string> = {
  // Lenexa
  "66215": "Lenexa",
  "66223": "Lenexa",
  "66213": "Lenexa",
  // Olathe
  "66061": "Olathe",
  "66062": "Olathe",
  // Overland Park
  "66209": "Overland Park",
  "66210": "Overland Park",
  "66211": "Overland Park",
  // Shawnee
  "66216": "Shawnee",
  "66217": "Shawnee",
  "66218": "Shawnee",
  // Stilwell / Spring Hill
  "66013": "Stilwell / Spring Hill",
  "66025": "Stilwell / Spring Hill",
  // Kansas City, MO
  "64114": "Kansas City, MO",
  "64131": "Kansas City, MO",
  "64113": "Kansas City, MO",
};

export function getCityFromZip(zip: string): string {
  if (!zip) return "Kansas City";
  const normalized = zip.trim().slice(0, 5);
  return ZIP_TO_CITY[normalized] ?? "Kansas City";
}
