// Coverage rates in lbs per 1,000 sq ft
export const GRASS_SEED_RATES = {
  bermuda:       { new_lawn: 2,   overseeding: 1,   label: 'Bermuda',          season: 'Warm Season' },
  kentucky_blue: { new_lawn: 3,   overseeding: 1.5, label: 'Kentucky Bluegrass', season: 'Cool Season' },
  tall_fescue:   { new_lawn: 8,   overseeding: 4,   label: 'Tall Fescue',      season: 'Cool Season' },
  fine_fescue:   { new_lawn: 4,   overseeding: 2,   label: 'Fine Fescue',      season: 'Cool Season' },
  ryegrass:      { new_lawn: 8,   overseeding: 4,   label: 'Perennial Ryegrass', season: 'Cool Season' },
  zoysia:        { new_lawn: 2,   overseeding: 1,   label: 'Zoysia',           season: 'Warm Season' },
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
    totalLbsN: Math.round(totalLbsN * 10) / 10,
    per1000sqft: Math.round(per1000sqft * 10) / 10,
  }
}

/**
 * Calculate mulch volume and bag count.
 * @param {number} sqft
 * @param {number} depthInches - desired mulch depth
 * @param {number} bagSizeCuFt - bag size in cubic feet (default 2)
 */
export function calculateMulch(sqft, depthInches, bagSizeCuFt = 2) {
  const cubicFeet = (sqft * depthInches) / 12
  const cubicYards = cubicFeet / 27
  const bagsNeeded = Math.ceil(cubicFeet / bagSizeCuFt)
  return {
    cubicFeet: Math.round(cubicFeet * 10) / 10,
    cubicYards: Math.round(cubicYards * 100) / 100,
    bagsNeeded,
    depthInches,
  }
}

/**
 * Calculate pre-emergent herbicide needed.
 * Default rate: 2.87 lbs per 1,000 sqft (midpoint of typical 2.5–3.25 lb range).
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
