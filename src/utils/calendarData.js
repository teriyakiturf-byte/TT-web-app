// 12-month lawn care calendar organized by zone group
// Zones 3-5 = north, Zones 6-7 = transition, Zones 8-10 = south

export const ZONE_GROUPS = {
  north:      { zones: [3,4,5],    label: 'Northern (Zones 3–5)',     grasses: 'Kentucky Blue, Fescue, Ryegrass' },
  transition: { zones: [6,7],      label: 'Transition (Zones 6–7)',   grasses: 'Fescue, Zoysia, Bermuda mix' },
  south:      { zones: [8,9,10],   label: 'Southern (Zones 8–10)',    grasses: 'Bermuda, Zoysia, St. Augustine' },
}

// Category colors for UI rendering
export const CATEGORY_COLORS = {
  fertilize: { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-400',  label: 'Fertilize' },
  mow:       { bg: 'bg-lime-100',   text: 'text-lime-800',   border: 'border-lime-500',   label: 'Mow' },
  seed:      { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-500',  label: 'Seed' },
  water:     { bg: 'bg-sky-100',    text: 'text-sky-800',    border: 'border-sky-500',    label: 'Water' },
  pest:      { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-400',    label: 'Pest & Disease' },
  aerate:    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: 'Aerate' },
  weed:      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400', label: 'Weed Control' },
  cleanup:   { bg: 'bg-stone-100',  text: 'text-stone-700',  border: 'border-stone-400',  label: 'Cleanup' },
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// Calendar data: calendarData[zoneGroup][monthIndex] = Task[]
export const calendarData = {
  north: [
    // January
    [
      { title: 'Stay off frozen turf',  category: 'mow',     priority: 'high',   description: 'Avoid foot traffic on frost-covered grass—cell damage creates dead spots visible in spring.' },
      { title: 'Plan & order supplies', category: 'cleanup', priority: 'low',    description: 'Review last year\'s issues. Order grass seed, soil amendments, and pre-emergent before the spring rush.' },
    ],
    // February
    [
      { title: 'Service equipment',     category: 'cleanup',   priority: 'medium', description: 'Sharpen mower blades, change oil, and inspect belts so you\'re ready when the season opens.' },
      { title: 'Soil test (send now)',  category: 'fertilize', priority: 'medium', description: 'Send a soil sample to your local extension lab—results take 2–3 weeks and guide spring fertility planning.' },
    ],
    // March
    [
      { title: 'Apply pre-emergent',    category: 'weed',      priority: 'high',   description: 'Apply granular pre-emergent when soil at 2-inch depth hits 50 °F—before forsythia blooms fully.' },
      { title: 'Light spring fertilizer', category: 'fertilize', priority: 'high', description: 'Apply 0.5 lb N/1,000 sqft with slow-release fertilizer once grass begins actively growing.' },
      { title: 'Rake winter debris',    category: 'cleanup',   priority: 'medium', description: 'Remove dead leaves and thatch over 0.5 inch to improve air and water penetration.' },
    ],
    // April
    [
      { title: 'Spot-seed bare patches', category: 'seed',     priority: 'high',   description: 'Seed thin areas with matching species; keep moist with light daily watering for 14–21 days.' },
      { title: 'Resume regular mowing', category: 'mow',       priority: 'high',   description: 'Start mowing when grass reaches 3.5–4 inches. Keep Kentucky Blue and Fescue at 3–3.5 inch height.' },
      { title: 'Broadleaf weed control', category: 'weed',     priority: 'medium', description: 'Apply broadleaf herbicide for dandelions and clover when temps are consistently 50–85 °F.' },
      { title: 'Start irrigation',      category: 'water',     priority: 'medium', description: 'Start up irrigation system; inspect for winter damage and set controller for 1 inch/week.' },
    ],
    // May
    [
      { title: 'Full spring fertilization', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft with slow-release fertilizer. Avoid fertilizing after mid-May.' },
      { title: 'Weekly mowing routine', category: 'mow',       priority: 'high',   description: 'Mow weekly at 3 inches; never remove more than 1/3 of the blade. Leave clippings to grasscycle.' },
      { title: 'Preventive grub control', category: 'pest',   priority: 'medium', description: 'Apply preventive grub control (imidacloprid) in late May; water in immediately after application.' },
    ],
    // June
    [
      { title: 'Switch to deep watering', category: 'water',  priority: 'high',   description: 'Shift to 1–1.5 inches/week in 2–3 sessions to encourage deep roots. Water 5–9 AM only.' },
      { title: 'Raise mowing height',   category: 'mow',      priority: 'medium', description: 'Raise cut to 3.5–4 inches for summer heat tolerance. Taller grass shades soil and conserves moisture.' },
      { title: 'Scout for fungal disease', category: 'pest',  priority: 'medium', description: 'Watch for summer patch or dollar spot. Apply fungicide preventively if disease was present last year.' },
    ],
    // July
    [
      { title: 'Managed dormancy (if dry)', category: 'water', priority: 'high',  description: 'If water is limited, apply 0.5 inch/week for managed dormancy rather than irregular watering that stresses turf.' },
      { title: 'No fertilizing',        category: 'fertilize', priority: 'high',   description: 'Do not fertilize cool-season grasses in July heat—nitrogen push during stress invites disease and burn.' },
      { title: 'Spot weed treatment only', category: 'weed',  priority: 'low',    description: 'Limit herbicide to spot-treatment of isolated weeds. Broadcast applications above 85 °F risk turf burn.' },
    ],
    // August
    [
      { title: 'Core aeration',         category: 'aerate',   priority: 'high',   description: 'Aerate compacted areas in late August ahead of fall seeding for better seed-to-soil contact.' },
      { title: 'Prep for fall seeding', category: 'seed',     priority: 'high',   description: 'Test pH; lime if below 6.0. Grade low spots. Aug 15–Sep 15 is the optimal seeding window.' },
      { title: 'Resume normal watering', category: 'water',   priority: 'medium', description: 'If dormant, resume 1 inch/week irrigation to bring grass out of dormancy before fall seeding.' },
    ],
    // September
    [
      { title: 'Overseed thin areas',   category: 'seed',     priority: 'high',   description: 'Best month for cool-season seeding: soil 50–65 °F, cool nights, and fall rains aid germination.' },
      { title: 'Fall fertilization',    category: 'fertilize', priority: 'high',  description: 'Apply 1 lb N/1,000 sqft with a balanced or high-K fertilizer to harden turf for winter.' },
      { title: 'Broadleaf weed cleanup', category: 'weed',    priority: 'medium', description: 'Fall is the most effective time—weeds are translocating nutrients to roots, drawing herbicide deep.' },
    ],
    // October
    [
      { title: 'Winterizer fertilizer', category: 'fertilize', priority: 'high',  description: 'Apply high-K winterizer fertilizer to support root development and carbohydrate storage.' },
      { title: 'Leaf removal',          category: 'cleanup',   priority: 'high',   description: 'Remove or mulch-mow fallen leaves; a mat blocks sunlight and promotes snow mold.' },
      { title: 'Winterize irrigation',  category: 'water',     priority: 'high',   description: 'Blow out irrigation lines before first hard freeze (28 °F for 4+ hours) to prevent cracking.' },
    ],
    // November
    [
      { title: 'Final mow to 2.5 inches', category: 'mow',   priority: 'high',   description: 'Cut turf to 2–2.5 inches before winter; reduces risk of snow mold and matting under snow cover.' },
      { title: 'Winterize equipment',   category: 'cleanup',   priority: 'medium', description: 'Drain or stabilize mower fuel, clean decks, lubricate moving parts, and store frost-free.' },
    ],
    // December
    [
      { title: 'Stay off frozen grass', category: 'mow',      priority: 'high',   description: 'All foot traffic on frozen turf crushes cells and creates dead spots in spring.' },
      { title: 'Plan next season',      category: 'cleanup',   priority: 'low',    description: 'Order soil amendments, pre-emergent, and grass seed before spring prices rise.' },
    ],
  ],

  transition: [
    // January
    [
      { title: 'Winter weed scouting',  category: 'weed',     priority: 'medium', description: 'Scout for Poa annua and henbit; spot-treat cool-season weeds actively growing in mild winters.' },
      { title: 'Send soil test',        category: 'fertilize', priority: 'medium', description: 'Results in 3–4 weeks guide spring fertility planning. Test pH and nutrient levels.' },
      { title: 'Service equipment',     category: 'cleanup',  priority: 'low',    description: 'Transition zone\'s longer season means more equipment wear—service during the off-season.' },
    ],
    // February
    [
      { title: 'Monitor soil temp',     category: 'weed',     priority: 'high',   description: 'Apply crabgrass pre-emergent when 2-inch soil temp hits 50 °F—typically late February in Zones 6–7.' },
      { title: 'Apply lime if needed',  category: 'fertilize', priority: 'medium', description: 'Apply lime per soil test now—it needs months to react with soil before spring planting.' },
    ],
    // March
    [
      { title: 'Apply pre-emergent',    category: 'weed',     priority: 'high',   description: 'Apply before soil reaches 55 °F at 2-inch depth; critical for crabgrass and goosegrass prevention.' },
      { title: 'Cool-season fertilization', category: 'fertilize', priority: 'high', description: 'Apply 0.5–1 lb N/1,000 sqft as cool-season grasses break dormancy. Hold off warm-season grass.' },
      { title: 'Spot-seed fescue',      category: 'seed',     priority: 'medium', description: 'Spot-seed tall fescue thin areas; water carefully. Fall is better but spring can succeed.' },
      { title: 'Begin mowing cool-season', category: 'mow',  priority: 'medium', description: 'Start mowing fescue and bluegrass at 3.5 inches when growth resumes.' },
    ],
    // April
    [
      { title: 'First warm-season fertilizer', category: 'fertilize', priority: 'high', description: 'Fertilize Bermuda and Zoysia when 50% of the lawn has greened up; apply 0.5–1 lb N/1,000 sqft.' },
      { title: 'Adjust mow heights by type', category: 'mow', priority: 'high',  description: 'Bermuda/Zoysia: 1–1.5 inches once active. Fescue: 3–3.5 inches. Use a sharp blade.' },
      { title: 'Broadleaf weed control', category: 'weed',   priority: 'medium', description: 'Apply broadleaf herbicide when weeds are active and temps are 55–85 °F.' },
      { title: 'Irrigation startup',    category: 'water',   priority: 'medium', description: 'Open system, check coverage, and set controller for 1 inch/week.' },
    ],
    // May
    [
      { title: 'Warm-season fertilize', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to Bermuda/Zoysia as they enter full active growth. Use slow-release.' },
      { title: 'Preventive grub control', category: 'pest',  priority: 'medium', description: 'Apply grub preventive; water in within 24 hours of application.' },
      { title: 'Fescue heat prep',      category: 'water',   priority: 'medium', description: 'Tall fescue begins heat stress in late May; raise mowing height to 4 inches and water 1.5 inches/week.' },
    ],
    // June
    [
      { title: 'Warm-season peak feeding', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to Bermuda/Zoysia—peak growing season, turf uses nutrients efficiently.' },
      { title: 'Differentiate watering', category: 'water',  priority: 'high',   description: 'Bermuda: 1 in/week. Zoysia: 0.75 in/week. Fescue: 1.5 in/week. All in early morning.' },
      { title: 'Watch for chinch bugs',  category: 'pest',   priority: 'medium', description: 'Scout St. Augustine and Zoysia for chinch bug damage (yellowing patches in sunny areas).' },
    ],
    // July
    [
      { title: 'Warm-season mid-summer fertilize', category: 'fertilize', priority: 'high', description: 'Apply 0.5–1 lb N/1,000 sqft to Bermuda/Zoysia to sustain summer growth. Skip for fescue.' },
      { title: 'Fescue managed dormancy', category: 'water', priority: 'high',  description: 'Allow fescue to go partially dormant if water is limited; maintain 0.5 inch/week minimum.' },
      { title: 'Aerate warm-season grass', category: 'aerate', priority: 'medium', description: 'Core aerate Bermuda and Zoysia in July peak growth for best recovery and thatch reduction.' },
    ],
    // August
    [
      { title: 'Warm-season final fertilize', category: 'fertilize', priority: 'high', description: 'Last summer fertilization for Bermuda/Zoysia—avoid feeding after August to prevent frost damage.' },
      { title: 'Fescue fall seeding prep', category: 'seed', priority: 'high', description: 'Prep for tall fescue overseeding: aerate, rake thatch, soil test; prime seeding window opens Sep.' },
      { title: 'Grub treatment if needed', category: 'pest', priority: 'medium', description: 'Apply curative grub treatment if turf lifts easily like carpet or you see spongy areas.' },
    ],
    // September
    [
      { title: 'Overseed tall fescue',  category: 'seed',    priority: 'high',   description: 'Best window for tall fescue overseeding in transition zones—soil 65–75 °F, good moisture.' },
      { title: 'Cool-season fertilize', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to cool-season areas; avoid fertilizing warm-season grasses.' },
      { title: 'Broadleaf weed control', category: 'weed',   priority: 'high',   description: 'Prime fall window for broadleaf control; weeds are pulling resources to roots.' },
    ],
    // October
    [
      { title: 'Second fall fertilization', category: 'fertilize', priority: 'high', description: 'Apply winterizer fertilizer to fescue lawns; support root development and cold hardiness.' },
      { title: 'Leaf management',        category: 'cleanup', priority: 'high',   description: 'Mulch-mow light leaf fall; rake or blow heavy accumulations weekly.' },
      { title: 'Winterize irrigation',  category: 'water',   priority: 'high',   description: 'Drain and blow out irrigation lines before first frost.' },
    ],
    // November
    [
      { title: 'Final mow (cool-season)', category: 'mow',  priority: 'high',   description: 'Final mow for fescue at 3 inches; warm-season grasses may still need occasional cuts until frost.' },
      { title: 'Cleanup and winterize', category: 'cleanup', priority: 'medium', description: 'Clear debris, winterize mower, and clean up leaf litter before winter.' },
    ],
    // December
    [
      { title: 'Dormant weed scouting', category: 'weed',   priority: 'low',    description: 'Note winter weed pressure (Poa annua, chickweed) to plan January spot-treatment strategy.' },
      { title: 'Plan next season',      category: 'cleanup', priority: 'low',    description: 'Order seed, pre-emergent, and fertilizer; review irrigation notes from the season.' },
    ],
  ],

  south: [
    // January
    [
      { title: 'Apply pre-emergent (spring weeds)', category: 'weed', priority: 'high', description: 'Apply pre-emergent in late January for spring crabgrass and goosegrass prevention.' },
      { title: 'Winter overseeded ryegrass care', category: 'mow',  priority: 'medium', description: 'Keep winter ryegrass mowed at 1.5–2 inches; fertilize lightly to maintain color through winter.' },
    ],
    // February
    [
      { title: 'Light fertilizer for ryegrass', category: 'fertilize', priority: 'medium', description: 'Apply 0.5 lb N/1,000 sqft to overseeded ryegrass to maintain winter color.' },
      { title: 'Soil test',             category: 'fertilize', priority: 'medium', description: 'Send soil test now for results before the spring growing season begins.' },
    ],
    // March
    [
      { title: 'Warm-season emerges',   category: 'mow',      priority: 'high',   description: 'Watch for Bermuda/Zoysia green-up; begin mowing base turf as it emerges through ryegrass.' },
      { title: 'Pre-emergent (summer crabgrass)', category: 'weed', priority: 'high', description: 'Apply second pre-emergent application as ryegrass transitions out and summer weeds pressure rises.' },
      { title: 'Fertilize as turf greens', category: 'fertilize', priority: 'medium', description: 'Apply 0.5 lb N/1,000 sqft once 50% of lawn has greened; avoid early feeding of dormant turf.' },
    ],
    // April
    [
      { title: 'Full spring fertilization', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft as warm-season grasses enter active growth; use a balanced fertilizer.' },
      { title: 'Lower mowing height',   category: 'mow',      priority: 'high',   description: 'Lower Bermuda to 0.75–1.5 inches; St. Augustine to 2.5–3 inches; Zoysia to 1–2 inches.' },
      { title: 'Irrigation startup',    category: 'water',    priority: 'high',   description: 'Start irrigation system; set for 1 inch/week and calibrate zones for uniform coverage.' },
      { title: 'Broadleaf weed control', category: 'weed',   priority: 'medium', description: 'Spot-treat remaining winter annuals and early summer broadleaf weeds.' },
    ],
    // May
    [
      { title: 'Fertilize every 6–8 weeks', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft; warm-season grasses are heavy feeders during peak growing season.' },
      { title: 'Watch for chinch bugs', category: 'pest',     priority: 'high',   description: 'Check St. Augustine in sunny areas; chinch bugs cause yellowing patches. Treat promptly.' },
      { title: 'Preventive grub control', category: 'pest',  priority: 'medium', description: 'Apply grub preventive; peak egg-laying season for Japanese beetles and other grubs.' },
    ],
    // June
    [
      { title: 'Deep watering program', category: 'water',    priority: 'high',   description: 'Bermuda: 1 in/week. Zoysia: 0.75 in/week. St. Augustine: 1.25 in/week. All in early AM.' },
      { title: 'Fertilize warm-season', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft; peak growing season—turf processes nitrogen efficiently in warm temps.' },
      { title: 'Brown patch watch (St. Augustine)', category: 'pest', priority: 'medium', description: 'High humidity + heat = brown patch risk; apply preventive fungicide if conditions persist.' },
    ],
    // July
    [
      { title: 'Core aerate Bermuda',   category: 'aerate',   priority: 'high',   description: 'Aerate Bermuda in peak summer growth for rapid recovery and thatch removal.' },
      { title: 'Water management',      category: 'water',    priority: 'high',   description: 'Maintain consistent watering; drought stress on warm-season grasses leads to weed invasion.' },
      { title: 'Mid-summer fertilize',  category: 'fertilize', priority: 'medium', description: 'Apply 0.5–1 lb N/1,000 sqft; continue feeding through summer for Bermuda and Zoysia.' },
    ],
    // August
    [
      { title: 'Final summer fertilize', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft; last heavy feeding before transitioning to fall maintenance.' },
      { title: 'Aerate St. Augustine',  category: 'aerate',   priority: 'medium', description: 'Aerate St. Augustine lawns in August; helps with compaction and fall root development.' },
      { title: 'Curative grub check',   category: 'pest',     priority: 'medium', description: 'Check turf for grub damage (spongy sections that pull up); treat if more than 5 grubs/sqft.' },
    ],
    // September
    [
      { title: 'Overseed with ryegrass (optional)', category: 'seed', priority: 'medium', description: 'Overseed Bermuda with annual ryegrass in late September for winter color; apply 8–10 lb/1,000 sqft.' },
      { title: 'Reduce fertilizer',     category: 'fertilize', priority: 'high', description: 'Taper fertilization; avoid high-N applications as warm-season grasses slow for fall. Use high-K.' },
      { title: 'Pre-emergent for winter weeds', category: 'weed', priority: 'high', description: 'Apply pre-emergent in mid-September to prevent Poa annua and cool-season weed invasion.' },
    ],
    // October
    [
      { title: 'Ryegrass care begins',  category: 'mow',      priority: 'medium', description: 'If overseeded, ryegrass germinates in October; keep moist and begin mowing at 2 inches.' },
      { title: 'Reduce irrigation frequency', category: 'water', priority: 'medium', description: 'Reduce watering as warm-season grasses go dormant; avoid keeping dormant turf wet.' },
      { title: 'Leaf cleanup',          category: 'cleanup',  priority: 'medium', description: 'Remove leaf litter regularly; even small accumulations mat on warm-season grass.' },
    ],
    // November
    [
      { title: 'Ryegrass maintenance',  category: 'mow',      priority: 'medium', description: 'Maintain ryegrass at 1.5–2 inches with regular mowing; fertilize lightly every 6–8 weeks.' },
      { title: 'Adjust irrigation to winter mode', category: 'water', priority: 'high', description: 'Reduce irrigation cycles significantly; protect from freeze by suspending system if frost expected.' },
    ],
    // December
    [
      { title: 'Winter ryegrass care',  category: 'mow',      priority: 'medium', description: 'Continue mowing ryegrass at 2 inches; apply 0.5 lb N/1,000 sqft for winter color.' },
      { title: 'Plan pre-emergent timing', category: 'weed',  priority: 'medium', description: 'Plan January/February pre-emergent applications to prevent spring crabgrass pressure.' },
    ],
  ],
}

export const MONTH_NAMES = MONTHS

/**
 * Determine the zone group from a USDA zone string like "7b" or "10a".
 * @param {string} zone - e.g. "6a", "9b"
 * @returns {'north'|'transition'|'south'|null}
 */
export function getZoneGroup(zone) {
  if (!zone) return null
  const num = parseInt(zone, 10)
  if (isNaN(num)) return null
  if (num <= 5) return 'north'
  if (num <= 7) return 'transition'
  return 'south'
}

/**
 * Get calendar tasks for a given zone and month.
 * @param {'north'|'transition'|'south'} zoneGroup
 * @param {number} monthIndex - 0-based
 * @returns {Task[]}
 */
export function getMonthTasks(zoneGroup, monthIndex) {
  return calendarData[zoneGroup]?.[monthIndex] ?? []
}
