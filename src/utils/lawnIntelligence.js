import { getZoneGroup } from './calendarData.js'

const SEASONS = {
  north: {
    spring: [2, 3, 4],   // Mar–May
    summer: [5, 6, 7],   // Jun–Aug
    fall:   [8, 9, 10],  // Sep–Nov
    winter: [11, 0, 1],  // Dec–Feb
  },
  transition: {
    spring: [1, 2, 3],
    summer: [4, 5, 6, 7],
    fall:   [8, 9, 10],
    winter: [11, 0],
  },
  south: {
    spring: [1, 2, 3],
    summer: [4, 5, 6, 7, 8],
    fall:   [9, 10],
    winter: [11, 0],
  },
}

function getSeason(zoneGroup, monthIndex) {
  const s = SEASONS[zoneGroup] || SEASONS.north
  for (const [season, months] of Object.entries(s)) {
    if (months.includes(monthIndex)) return season
  }
  return 'winter'
}

/**
 * Check if rain is forecast within the next N hours based on OWM forecast data.
 * OWM /forecast returns 3-hour intervals, each with `dt` (unix timestamp).
 */
function rainExpectedWithinHours(forecastList, hours) {
  if (!forecastList || forecastList.length === 0) return false
  const cutoff = Date.now() / 1000 + hours * 3600
  return forecastList.some(item =>
    item.dt <= cutoff && (item.rain?.['3h'] > 0 || item.weather?.[0]?.main === 'Rain' || item.weather?.[0]?.main === 'Drizzle' || item.weather?.[0]?.main === 'Thunderstorm')
  )
}

/**
 * Generate lawn care tips based on current conditions.
 * @param {{ current: object, forecast: object[] }} weather - OWM API data
 * @param {string} zone - USDA zone string like "7b"
 * @param {number} monthIndex - 0-based month (new Date().getMonth())
 * @returns {{ type: 'warning'|'info'|'success', icon: string, title: string, body: string }[]}
 */
export function generateTips(weather, zone, monthIndex) {
  const tips = []
  const zoneGroup = getZoneGroup(zone)
  const season = getSeason(zoneGroup || 'north', monthIndex)

  const current = weather?.current
  const forecastList = weather?.forecast?.list ?? []

  const temp = current?.main?.temp ?? null          // °F
  const humidity = current?.main?.humidity ?? null  // %
  const windSpeed = current?.wind?.speed ?? null    // mph
  const weatherMain = current?.weather?.[0]?.main ?? ''

  // ── Weather-based rules ──────────────────────────────────────────────────

  if (rainExpectedWithinHours(forecastList, 24)) {
    tips.push({
      type: 'warning',
      icon: '🌧️',
      title: "Hold off on mowing",
      body: "Rain is forecast within the next 24 hours. Mowing wet grass tears blades and spreads disease. Wait until the lawn dries.",
    })
    tips.push({
      type: 'info',
      icon: '🚫',
      title: "Skip chemical applications",
      body: "Rain will wash herbicides and fertilizers off the lawn before absorption. Wait for a dry window of at least 24–48 hours.",
    })
  }

  if (temp !== null && temp > 90) {
    tips.push({
      type: 'warning',
      icon: '🌡️',
      title: "Heat stress alert",
      body: `It's ${Math.round(temp)} °F—water deeply in the early morning (5–9 AM) to reduce evaporation. Cool-season grasses may wilt; this is normal and usually recovers overnight.`,
    })
  }

  if (temp !== null && temp < 40) {
    tips.push({
      type: 'warning',
      icon: '❄️',
      title: "Too cold to fertilize",
      body: "Soil temperatures are likely below 50 °F—roots won't absorb nutrients effectively. Wait for consistently warmer conditions before applying fertilizer.",
    })
  }

  if (windSpeed !== null && windSpeed > 15) {
    tips.push({
      type: 'warning',
      icon: '💨',
      title: "Avoid spraying today",
      body: `Wind is at ${Math.round(windSpeed)} mph. Herbicide, fungicide, and liquid fertilizer sprays will drift off-target in these conditions. Wait for winds below 10 mph.`,
    })
  }

  if (humidity !== null && humidity < 25 && temp !== null && temp > 75) {
    tips.push({
      type: 'warning',
      icon: '🏜️',
      title: "Low humidity – drought watch",
      body: "Very low humidity combined with heat rapidly dries out turf. Check soil moisture at 3-inch depth; if dry, water immediately even if it's not your scheduled day.",
    })
  }

  if (weatherMain === 'Thunderstorm') {
    tips.push({
      type: 'warning',
      icon: '⛈️',
      title: "Thunderstorm nearby",
      body: "Stay indoors and postpone all lawn work. After the storm, wait until turf drains (12–24 hours) before mowing.",
    })
  }

  if (temp !== null && temp >= 45 && temp <= 65 && humidity !== null && humidity > 70 && rainExpectedWithinHours(forecastList, 48)) {
    tips.push({
      type: 'info',
      icon: '🍄',
      title: "Fungal disease conditions",
      body: "Cool, wet, humid weather is ideal for lawn fungus (brown patch, dollar spot). Avoid evening watering and mow regularly to improve air circulation.",
    })
  }

  // ── Season-based rules ───────────────────────────────────────────────────

  if (season === 'spring' && monthIndex >= 2 && monthIndex <= 3) {
    if (!rainExpectedWithinHours(forecastList, 24)) {
      tips.push({
        type: 'info',
        icon: '🌱',
        title: "Pre-emergent window open",
        body: "Spring conditions are active. If you haven't applied pre-emergent herbicide yet, check your soil temperature—apply when it reaches 50 °F at 2-inch depth to stop crabgrass.",
      })
    }
  }

  if (season === 'summer') {
    tips.push({
      type: 'info',
      icon: '✂️',
      title: "Raise your mowing height",
      body: "In summer heat, taller grass (3.5–4 inches for cool-season, 1.5–2 inches for warm-season) shades the soil, retains moisture, and outcompetes weeds.",
    })
  }

  if (season === 'fall' && monthIndex >= 8 && monthIndex <= 9) {
    tips.push({
      type: 'success',
      icon: '🌾',
      title: "Prime time: aerate & overseed",
      body: `Fall is the best season for lawn renovation${zoneGroup === 'north' || zoneGroup === 'transition' ? ' for cool-season grasses' : ''}. Core aerate first, then overseed for best results.`,
    })
  }

  if (monthIndex === 9 || monthIndex === 10) {
    tips.push({
      type: 'info',
      icon: '🍂',
      title: "Keep leaves off the lawn",
      body: "A thick mat of fallen leaves blocks sunlight and promotes snow mold and fungal disease. Mulch-mow light leaf fall; rake heavy accumulations weekly.",
    })
  }

  if (season === 'winter') {
    tips.push({
      type: 'info',
      icon: '🥶',
      title: "Protect dormant turf",
      body: "Avoid all foot traffic on frozen or frost-covered grass—crushed cells create dead spots visible in spring. Keep paths clear with mats or pavers.",
    })
  }

  // ── Zone-specific rules ──────────────────────────────────────────────────

  if (zoneGroup === 'north' && season === 'summer') {
    tips.push({
      type: 'info',
      icon: '💧',
      title: "Cool-season summer watering",
      body: "Kentucky Blue, Fescue, and Ryegrass go semi-dormant in high heat. If short on water, apply 0.5 inch/week for managed dormancy rather than irregular watering which stresses the plant further.",
    })
  }

  if (zoneGroup === 'south' && season === 'fall' && monthIndex === 9) {
    tips.push({
      type: 'success',
      icon: '🌿',
      title: "Ryegrass overseeding time",
      body: "Late September–October is the window to overseed Bermuda or Zoysia with annual ryegrass for winter color. Apply 8–10 lbs/1,000 sqft and keep moist until germination.",
    })
  }

  if (zoneGroup === 'transition' && season === 'summer') {
    tips.push({
      type: 'info',
      icon: '🔀',
      title: "Two grass types, two schedules",
      body: "In the transition zone you may have both warm-season (Bermuda, Zoysia) and cool-season (Fescue) grasses. Warm-season grasses thrive now; cool-season grasses need extra water and shade protection.",
    })
  }

  // ── Positive tip if conditions are ideal ─────────────────────────────────

  if (
    temp !== null && temp >= 65 && temp <= 80 &&
    humidity !== null && humidity >= 40 && humidity <= 70 &&
    !rainExpectedWithinHours(forecastList, 6) &&
    (windSpeed === null || windSpeed < 10)
  ) {
    tips.push({
      type: 'success',
      icon: '✅',
      title: "Great lawn care conditions today",
      body: "Mild temperature, moderate humidity, and light wind make today ideal for mowing, spraying, seeding, or fertilizing. Get out there!",
    })
  }

  return tips
}

/**
 * Determine the current season name for display.
 */
export function getCurrentSeason(zone, monthIndex) {
  const zg = getZoneGroup(zone) || 'north'
  return getSeason(zg, monthIndex)
}
