// Coverage rates in lbs per 1,000 sq ft
// Rates sourced from university extension guidelines and the Teriyaki Turf lawn guide.
// new_lawn = full renovation/bare soil; overseeding = thickening existing turf
export const GRASS_SEED_RATES = {
  kentucky_blue: { new_lawn: 3.5, overseeding: 2.5, label: 'Kentucky Bluegrass', season: 'Cool Season',
    note: 'Slow germination (14–30 days). Best seeded in early fall. Often mixed with ryegrass for faster establishment.' },
  tall_fescue:   { new_lawn: 9,   overseeding: 6,   label: 'Tall Fescue',        season: 'Cool Season',
    note: 'High rate due to large seed size. Excellent drought tolerance once established. Prime seeding window: late Aug–mid Oct.' },
  fine_fescue:   { new_lawn: 4,   overseeding: 4,   label: 'Fine Fescue',        season: 'Cool Season',
    note: 'Includes creeping red, chewings, and hard fescue varieties. Tolerates shade and low fertility.' },
  ryegrass:      { new_lawn: 9,   overseeding: 6,   label: 'Perennial Ryegrass', season: 'Cool Season',
    note: 'Fast germination (5–10 days). Often mixed with bluegrass. Also used for winter overseeding in southern zones.' },
  ryegrass_annual:{ new_lawn: 12, overseeding: 12,  label: 'Annual Ryegrass (Winter Color)', season: 'Warm Season Overseeding',
    note: 'Used in Zones 8–11 to overseed dormant Bermuda/Zoysia for winter color. Apply 10–15 lbs/1,000 sqft. Dies out when temps rise above 85–90°F in spring.' },
  bermuda:       { new_lawn: 2,   overseeding: 1.5, label: 'Bermuda',            season: 'Warm Season',
    note: 'Use hulled seed for faster germination. Soil temp must be 65°F+. Very slow from seed — plugs or sod often preferred for faster results.' },
  zoysia:        { new_lawn: 2,   overseeding: 1,   label: 'Zoysia',             season: 'Warm Season',
    note: 'Extremely slow to establish from seed (1–2 growing seasons). Plugging or sodding strongly preferred for most homeowners.' },
  centipede:     { new_lawn: 0.5, overseeding: 0.3, label: 'Centipede',          season: 'Warm Season',
    note: 'Very low seeding rate — tiny seed. Prefers acidic soils (pH 5.0–6.0). Do not over-fertilize; "centipede decline" from excess nitrogen is common.' },
  bahia:         { new_lawn: 6,   overseeding: 3,   label: 'Bahiagrass',         season: 'Warm Season',
    note: 'Coarse, low-maintenance grass for Zones 8–10. Excellent drought and wear tolerance. Germinates slowly (21–28 days).' },
}

// Mowing height reference data by grass type
export const MOWING_HEIGHTS = {
  kentucky_blue: { label: 'Kentucky Bluegrass', min: 2.5, max: 3.5, summer: '3.5–4"', season: 'Cool Season',
    note: 'Raise to 3.5–4" during summer heat stress to shade soil and reduce moisture loss.' },
  tall_fescue:   { label: 'Tall Fescue',        min: 3,   max: 4,   summer: '4"',      season: 'Cool Season',
    note: 'Keep at 4" through summer — this is the most heat-tolerant height for tall fescue.' },
  fine_fescue:   { label: 'Fine Fescue',        min: 2.5, max: 3.5, summer: '3.5"',    season: 'Cool Season',
    note: 'Tolerates lower mowing than other cool-season grasses. Avoid scalping.' },
  ryegrass:      { label: 'Perennial Ryegrass', min: 2,   max: 3.5, summer: '3–3.5"',  season: 'Cool Season',
    note: 'Sharp blades critical — ryegrass tears easily and shows brown tips with dull blades.' },
  bermuda:       { label: 'Bermuda',            min: 0.5, max: 2,   summer: '1–1.5"',  season: 'Warm Season',
    note: 'Home lawns: 1–2". Golf/sports: 0.5–1". Frequent mowing required at low heights.' },
  zoysia:        { label: 'Zoysia',             min: 1,   max: 2.5, summer: '1.5–2"',  season: 'Warm Season',
    note: 'Dense growth tolerates low mowing. Requires sharp blades — zoysia is tough on equipment.' },
  st_augustine:  { label: 'St. Augustine',      min: 2.5, max: 4,   summer: '3–4"',    season: 'Warm Season',
    note: 'Sun areas: 2.5–3". Shade areas: 3–4". Higher cuts dramatically improve shade tolerance.' },
  centipede:     { label: 'Centipede',          min: 1.5, max: 2.5, summer: '2"',      season: 'Warm Season',
    note: 'Never scalp centipede — it has very limited ability to recover from aggressive cutting.' },
  bahia:         { label: 'Bahiagrass',         min: 3,   max: 4,   summer: '3.5–4"',  season: 'Warm Season',
    note: 'Coarse texture requires sharp blades and higher mowing height for clean cut.' },
}

/**
 * Calculate grass seed needed.
 * @param {number} sqft
 * @param {string} grassType - key from GRASS_SEED_RATES
 * @param {'new_lawn'|'overseeding'} scenario
 */
export function calculateGrassSeed(sqft, grassType, scenario) {
  const rates = GRASS_SEED_RATES[grassType]
  if (!rates) return null
  const rate = rates[scenario]
  const lbsNeeded = (sqft / 1000) * rate
  return {
    lbsNeeded: Math.round(lbsNeeded * 10) / 10,
    rate,
    grassType,
    scenario,
    label: rates.label,
    note: rates.note,
  }
}

/**
 * Calculate fertilizer product weight needed.
 * Target: 1 lb actual Nitrogen per 1,000 sqft per application.
 * @param {number} sqft
 * @param {number} nPercent - the N value from the N-P-K label (e.g., 30 for "30-0-4")
 * @param {number} targetLbsN - target lbs of N per 1,000 sqft (default 1.0)
 */
export function calculateFertilizer(sqft, nPercent, targetLbsN = 1.0) {
  if (!nPercent || nPercent <= 0) return null
  const totalLbsN = (sqft / 1000) * targetLbsN
  const lbsOfProduct = totalLbsN / (nPercent / 100)
  const per1000sqft = lbsOfProduct / (sqft / 1000)
  return {
    lbsOfProduct: Math.round(lbsOfProduct * 10) / 10,
    totalLbsN:    Math.round(totalLbsN * 10) / 10,
    per1000sqft:  Math.round(per1000sqft * 10) / 10,
  }
}

/**
 * Calculate mulch volume and bag count.
 * @param {number} sqft
 * @param {number} depthInches
 * @param {number} bagSizeCuFt - default 2 cu ft
 */
export function calculateMulch(sqft, depthInches, bagSizeCuFt = 2) {
  const cubicFeet  = (sqft * depthInches) / 12
  const cubicYards = cubicFeet / 27
  const bagsNeeded = Math.ceil(cubicFeet / bagSizeCuFt)
  return {
    cubicFeet:  Math.round(cubicFeet * 10) / 10,
    cubicYards: Math.round(cubicYards * 100) / 100,
    bagsNeeded,
    depthInches,
    warning: depthInches > 4
      ? 'Mulch deeper than 4" can suffocate plant roots and cause crown rot. Recommended range: 2–3".'
      : depthInches < 1
      ? 'Less than 1" provides minimal weed suppression or moisture benefit.'
      : null,
  }
}

/**
 * Calculate pre-emergent herbicide needed.
 * Default rate: 2.87 lbs per 1,000 sqft.
 * @param {number} sqft
 * @param {number} ratePerThousand
 */
export function calculatePreEmergent(sqft, ratePerThousand = 2.87) {
  const lbsNeeded = (sqft / 1000) * ratePerThousand
  return {
    lbsNeeded: Math.round(lbsNeeded * 10) / 10,
    ratePerThousand,
  }
}
