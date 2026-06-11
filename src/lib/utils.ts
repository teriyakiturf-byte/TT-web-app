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
