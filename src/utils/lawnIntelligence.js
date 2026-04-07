import { getZoneGroup } from './calendarData.js'

const SEASONS = {
  north: {
    spring: [2, 3, 4],
    summer: [5, 6, 7],
    fall:   [8, 9, 10],
    winter: [11, 0, 1],
  },
  transition: {
    spring: [2, 3, 4],
    summer: [5, 6, 7],
    fall:   [8, 9, 10],
    winter: [11, 0, 1],
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

// WMO weather code groups for rain/thunderstorm detection
function isRainCode(code) { return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) }
function isThunderstormCode(code) { return code >= 95 }

function rainExpectedWithinHours(hourly, hours) {
  if (!hourly?.time?.length) return false
  const cutoff = Date.now() + hours * 3600 * 1000
  return hourly.time.some((t, i) =>
    new Date(t).getTime() <= cutoff &&
    (hourly.precipitation[i] > 0 || isRainCode(hourly.weather_code?.[i] ?? 0))
  )
}

function rainAmountNext48h(hourly) {
  if (!hourly?.time?.length) return 0
  const cutoff = Date.now() + 48 * 3600 * 1000
  return hourly.time.reduce((sum, t, i) =>
    new Date(t).getTime() <= cutoff ? sum + (hourly.precipitation[i] ?? 0) : sum
  , 0)
}

/**
 * Generate lawn care tips based on current conditions.
 * @param {object} weather - Open-Meteo API response
 * @param {string} zone - USDA zone string e.g. "6a"
 * @param {number} monthIndex - 0-based month
 * @returns {{ type: 'warning'|'info'|'success', icon: string, title: string, body: string }[]}
 */
export function generateTips(weather, zone, monthIndex) {
  const tips = []
  const zoneGroup = getZoneGroup(zone)
  const season = getSeason(zoneGroup || 'north', monthIndex)

  const current  = weather?.current
  const hourly   = weather?.hourly

  const tempF     = current?.temperature_2m    != null ? Math.round(current.temperature_2m)    : null
  const humidity  = current?.relative_humidity_2m ?? null  // %
  const windSpeed = current?.wind_speed_10m       ?? null  // mph (already converted by Open-Meteo)
  const weatherCode = current?.weather_code       ?? null
  const isThunderstorm = weatherCode != null && isThunderstormCode(weatherCode)
  const rainNext48  = rainAmountNext48h(hourly)

  // ─── WEATHER-BASED ────────────────────────────────────────────────────────

  if (rainExpectedWithinHours(hourly, 24)) {
    tips.push({
      type: 'warning', icon: '🌧️',
      title: 'Hold off on mowing',
      body: 'Rain is forecast within 24 hours. Mowing wet grass tears blades and spreads disease. Wait until the lawn has fully dried.',
    })
  }

  if (rainNext48 > 0.5) {
    tips.push({
      type: 'warning', icon: '🚫',
      title: 'Skip fertilizer & herbicides today',
      body: 'More than 0.5" of rain is expected in the next 48 hours. Applications now will wash into storm drains before absorbing. Wait for a dry window.',
    })
  } else if (rainExpectedWithinHours(hourly, 24)) {
    tips.push({
      type: 'info', icon: '🚫',
      title: 'Hold chemical applications',
      body: 'Rain expected shortly — herbicides and fertilizers won\'t absorb properly. Wait for a dry 24–48 hour window.',
    })
  }

  if (tempF !== null && tempF > 95) {
    tips.push({
      type: 'warning', icon: '🌡️',
      title: 'Extreme heat — water now',
      body: `It's ${tempF}°F. Cool-season grasses enter stress above 90°F. Water deeply this morning (5–9 AM) and raise mowing height to 4" to shade the soil. Do NOT apply nitrogen fertilizer in this heat.`,
    })
  } else if (tempF !== null && tempF > 90) {
    tips.push({
      type: 'warning', icon: '☀️',
      title: 'Heat stress alert',
      body: `At ${tempF}°F, cool-season grasses are stressed. Water deeply in early morning only. Raise mowing height to 3.5–4" — taller grass shades roots and retains moisture.`,
    })
  }

  if (tempF !== null && tempF < 34) {
    tips.push({
      type: 'warning', icon: '❄️',
      title: 'Frost — stay off the lawn',
      body: 'Temperature is at or below freezing. Walking on frost-covered grass crushes cell walls and creates dead spots visible in spring. Keep all traffic off the turf.',
    })
  } else if (tempF !== null && tempF < 40) {
    tips.push({
      type: 'warning', icon: '🥶',
      title: 'Too cold to fertilize',
      body: 'Soil temperatures are likely below 50°F — roots won\'t absorb nutrients. Hold all nitrogen applications until soil warms consistently above 50°F.',
    })
  }

  if (windSpeed !== null && windSpeed > 15) {
    tips.push({
      type: 'warning', icon: '💨',
      title: 'Too windy to spray',
      body: `Wind is ${Math.round(windSpeed)} mph. Herbicide, fungicide, and liquid fertilizer drift off-target above 10 mph. Wait for calm conditions — early morning is usually the calmest window.`,
    })
  } else if (windSpeed !== null && windSpeed > 10) {
    tips.push({
      type: 'info', icon: '🌬️',
      title: 'Spray caution — winds elevated',
      body: `Wind is ${Math.round(windSpeed)} mph. Avoid broadcast liquid applications — spot treatments only until winds drop below 10 mph.`,
    })
  }

  if (humidity !== null && humidity < 25 && tempF !== null && tempF > 75) {
    tips.push({
      type: 'warning', icon: '🏜️',
      title: 'Low humidity drought watch',
      body: 'Very low humidity + heat is rapidly desiccating turf. Check soil moisture at 3 inches; if dry, water immediately even if it\'s not your scheduled day.',
    })
  }

  if (isThunderstorm) {
    tips.push({
      type: 'warning', icon: '⛈️',
      title: 'Thunderstorm nearby',
      body: 'Stay indoors and postpone all lawn work. After the storm, wait 12–24 hours for turf to drain before mowing.',
    })
  }

  // Brown patch: hot days + high humid nights
  if (tempF !== null && tempF > 85 && humidity !== null && humidity > 80 && season === 'summer') {
    tips.push({
      type: 'warning', icon: '🍄',
      title: 'Brown patch conditions',
      body: 'Hot days + high humidity create ideal brown patch and dollar spot conditions. Switch to early morning watering only, avoid high-N feeding, and consider a preventive fungicide (azoxystrobin or propiconazole).',
    })
  }

  // Pythium blight emergency
  if (tempF !== null && tempF > 90 && humidity !== null && humidity > 90) {
    tips.push({
      type: 'warning', icon: '🚨',
      title: 'Pythium blight risk — act fast',
      body: 'Extreme heat + humidity creates Pythium blight conditions — a disease that can destroy your lawn in 24–48 hours. Watch for greasy, water-soaked patches that rapidly turn tan. Apply fungicide (mefenoxam) immediately if spotted.',
    })
  }

  // Dollar spot: cool moist spring/fall
  if (tempF !== null && tempF >= 60 && tempF <= 80 && humidity !== null && humidity > 75 && season !== 'summer' && season !== 'winter') {
    tips.push({
      type: 'info', icon: '⚪',
      title: 'Dollar spot watch',
      body: 'Cool, moist conditions favor dollar spot — look for silver-dollar-sized bleached spots with cottony mycelium in the morning. A light nitrogen application and morning-only irrigation are your best defenses.',
    })
  }

  // Evening watering reminder in warm months
  if (tempF !== null && tempF > 55 && season !== 'winter') {
    tips.push({
      type: 'info', icon: '🌅',
      title: 'Water early morning — not evenings',
      body: 'Evening irrigation leaves blades wet overnight — the leading trigger for brown patch, dollar spot, and red thread. Set your irrigation controller to run 5–9 AM so turf dries by midday.',
    })
  }

  // ─── SEASON-BASED ─────────────────────────────────────────────────────────

  // Pre-emergent spring window
  if (season === 'spring' && monthIndex >= 2 && monthIndex <= 4 && !rainExpectedWithinHours(hourly, 24)) {
    tips.push({
      type: 'info', icon: '🛡️',
      title: 'Pre-emergent window — check soil temp',
      body: 'Apply granular pre-emergent when soil at 2" depth reaches 50°F (forsythia in full bloom is a natural indicator). Do not overseed for 8–12 weeks after most pre-emergent products. Dimension (dithiopyr) offers more flexibility if you need to overseed sooner.',
    })
  }

  // Summer mowing height
  if (season === 'summer') {
    tips.push({
      type: 'info', icon: '✂️',
      title: 'Raise mowing height for summer',
      body: 'Taller grass shades soil, retains moisture, and outcompetes weeds. Cool-season: 3.5–4". Bermuda: stay at normal height. St. Augustine: 3–4". Never remove more than 1/3 of the blade in a single cut — violations stress the plant and open it to disease.',
    })
  }

  // Grub treatment window
  if (monthIndex >= 5 && monthIndex <= 6) {
    tips.push({
      type: 'info', icon: '🐛',
      title: 'Grub preventive window open',
      body: 'June–early July is the optimal window for preventive grub control. Chlorantraniliprole (Acelepryn) is the safest option with a 3-month window. Imidacloprid (Merit) must be applied before eggs hatch. Water in with 0.5" of irrigation immediately after.',
    })
  }

  // Fall aerate & overseed (north/transition)
  if (season === 'fall' && monthIndex >= 7 && monthIndex <= 9 && (zoneGroup === 'north' || zoneGroup === 'transition')) {
    tips.push({
      type: 'success', icon: '🌾',
      title: 'Prime window: aerate & overseed',
      body: 'Late August–October is the most important season for cool-season lawn renovation. Core aerate first (2 passes on clay soils), then overseed immediately — aeration holes provide 40–60% better germination than broadcast seeding. This combination is the single highest-impact thing you can do for your lawn.',
    })
  }

  // Winterizer fertilizer — October (north/transition)
  if (monthIndex === 9 && (zoneGroup === 'north' || zoneGroup === 'transition')) {
    tips.push({
      type: 'success', icon: '🌱',
      title: 'Apply winterizer fertilizer this month',
      body: 'October is the highest-value fertilizer application of the year for cool-season lawns. Use a high-potassium blend (24-0-12 or 22-0-11) — it stores carbohydrates in roots for winter survival and produces the earliest, darkest spring green-up.',
    })
  }

  // Fertilizer blackout reminder (transition zone winter)
  if (zoneGroup === 'transition' && (monthIndex === 10 || monthIndex === 11 || monthIndex === 0 || monthIndex === 1)) {
    tips.push({
      type: 'warning', icon: '⚖️',
      title: 'Check local fertilizer blackout dates',
      body: 'Many municipalities restrict winter applications. Johnson County, KS prohibits fertilizer Nov 1–Mar 1. Maryland bans applications Oct 16–Mar 1. Check your local ordinances before applying — violations carry fines.',
    })
  }

  // Leaf cleanup — Oct/Nov
  if (monthIndex === 9 || monthIndex === 10) {
    tips.push({
      type: 'info', icon: '🍂',
      title: 'Keep leaves off the lawn',
      body: 'A matted leaf layer blocks sunlight and traps moisture, killing grass within 2–3 weeks and promoting snow mold. Mulch-mow light coverage; bag or compost heavy accumulations weekly. Don\'t let any area stay buried for more than 7 days.',
    })
  }

  // Winter protection
  if (season === 'winter') {
    tips.push({
      type: 'info', icon: '🥶',
      title: 'Protect dormant turf',
      body: 'Avoid foot traffic on frozen or frost-covered grass — crushed cells create dead spots in spring. Keep paths clear with stepping stones or temporary mats. Avoid piling snow from plowing/shoveling on lawn areas.',
    })
  }

  // ─── ZONE-SPECIFIC ────────────────────────────────────────────────────────

  // Scalp warm-season spring green-up
  if (zoneGroup === 'south' && season === 'spring' && monthIndex >= 2 && monthIndex <= 3) {
    tips.push({
      type: 'info', icon: '🌿',
      title: 'Scalp warm-season grass now',
      body: 'Once 50% of your Bermuda or Zoysia shows green, scalp it to 0.5–1" to remove dead gray material. Do this once per year — it accelerates green-up by 2–3 weeks by letting sunlight reach the soil. Bag clippings; don\'t scalp cool-season grasses.',
    })
  }

  // Cool-season summer dormancy (north)
  if (zoneGroup === 'north' && season === 'summer') {
    tips.push({
      type: 'info', icon: '💧',
      title: 'Cool-season dormancy is normal',
      body: 'Kentucky Blue, Fescue, and Ryegrass naturally slow or brown in summer heat. If water is restricted, apply 0.5"/week for managed dormancy — consistency is key. Irregular watering stresses the plant more than sustained dormancy. Turf fully recovers when cool weather returns.',
    })
  }

  // Ryegrass overseeding window (south fall)
  if (zoneGroup === 'south' && monthIndex >= 9 && monthIndex <= 10) {
    tips.push({
      type: 'success', icon: '🌿',
      title: 'Ryegrass overseeding window',
      body: 'Mid-October to mid-November: overseed Bermuda/Zoysia with annual or perennial ryegrass for winter color. Scalp base turf to 0.5–1" first, seed at 10–15 lbs/1,000 sqft, and keep moist until germination. Annual ryegrass dies out naturally when temps rise above 85–90°F in spring.',
    })
  }

  // Stop N on warm-season grasses in fall
  if (zoneGroup === 'south' && season === 'fall') {
    tips.push({
      type: 'info', icon: '🛑',
      title: 'Stop nitrogen on warm-season grass',
      body: 'Apply the last nitrogen to Bermuda/Zoysia/St. Augustine 6–8 weeks before your first expected frost. Late nitrogen forces tender growth that is highly susceptible to freeze damage. Switch to a potassium-only product to harden the turf for dormancy.',
    })
  }

  // Transition dual-grass reminder
  if (zoneGroup === 'transition' && season === 'summer') {
    tips.push({
      type: 'info', icon: '🔀',
      title: 'Transition zone: two grass schedules',
      body: 'Warm-season grasses (Bermuda, Zoysia) thrive now — fertilize and water actively. Cool-season grasses (Tall Fescue) are stressed — hold nitrogen, raise mowing height to 4", and water 1.5"/week minimum. Treating them the same is one of the most common transition-zone mistakes.',
    })
  }

  // ─── IDEAL CONDITIONS ─────────────────────────────────────────────────────

  if (
    tempF !== null && tempF >= 60 && tempF <= 82 &&
    humidity !== null && humidity >= 35 && humidity <= 70 &&
    !rainExpectedWithinHours(hourly, 6) &&
    (windSpeed === null || windSpeed < 10)
  ) {
    tips.push({
      type: 'success', icon: '✅',
      title: 'Great conditions for lawn work today',
      body: 'Mild temperature, comfortable humidity, light wind, and no immediate rain make today ideal for mowing, fertilizing, spraying, or seeding. Follow the 1/3 rule when mowing and water any granular applications in lightly.',
    })
  }

  return tips
}

export function getCurrentSeason(zone, monthIndex) {
  const zg = getZoneGroup(zone) || 'north'
  return getSeason(zg, monthIndex)
}
