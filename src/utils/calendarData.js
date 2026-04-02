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
      { title: 'Fertilizer blackout in effect', category: 'fertilize', priority: 'high', description: 'Johnson County, KS prohibits fertilizer applications Nov 1–Mar 1. Many other municipalities have similar restrictions—check local ordinances before any application.' },
      { title: 'Winter weed scouting',  category: 'weed',     priority: 'medium', description: 'Scout for Poa annua and henbit actively growing in mild KC winters. Spot-treat with a post-emergent labeled for cool-season weeds.' },
      { title: 'Send soil test',        category: 'fertilize', priority: 'medium', description: 'Send a core sample to K-State Extension or a private lab—results arrive in 2–3 weeks and guide your March fertilizer plan once the blackout lifts.' },
      { title: 'Service equipment',     category: 'cleanup',  priority: 'low',    description: 'Sharpen mower blades, change oil, check belts, and order supplies before the spring rush.' },
    ],
    // February
    [
      { title: 'Monitor forsythia & soil temp', category: 'weed', priority: 'high', description: 'Forsythia budding signals soil approaching 50 °F at 2 inches—your natural pre-emergent indicator. In KC Zone 6a, this typically occurs mid-to-late February. Have product on hand and ready to apply.' },
      { title: 'Fertilizer blackout ends March 1', category: 'fertilize', priority: 'medium', description: 'Johnson County fertilizer blackout ends March 1. Prepare a slow-release spring fertilizer application so you can apply immediately when the window opens and fescue breaks dormancy.' },
      { title: 'Apply lime if needed',  category: 'fertilize', priority: 'medium', description: 'Apply lime per soil test—lime needs 2–3 months to react with soil before it affects pH. Target pH 6.0–6.5 for tall fescue.' },
      { title: 'Thatch assessment',     category: 'cleanup',  priority: 'low',    description: 'Pull a small plug of turf and measure the spongy brown layer above soil. Over 0.5 inch of thatch indicates spring dethatching or fall core aeration is needed.' },
    ],
    // March
    [
      { title: 'Apply pre-emergent (forsythia in full bloom)', category: 'weed', priority: 'high', description: 'Apply granular pre-emergent when forsythia reaches full bloom—this aligns with soil at 50–55 °F at 2-inch depth. In KC Zone 6a, target late February through mid-March. Pendimethalin (2.3–4.6 lbs/1k) or prodiamine (1.5–2.5 lbs/1k). Do not overseed for 8–12 weeks after application.' },
      { title: 'Cool-season fertilization', category: 'fertilize', priority: 'high', description: 'Blackout ends March 1 (Johnson County). Apply 0.5–1 lb N/1,000 sqft with slow-release fertilizer as tall fescue resumes active growth. Avoid applying to dormant warm-season grasses.' },
      { title: 'Spot-seed fescue bare patches', category: 'seed', priority: 'medium', description: 'Spring seeding is a compromise—fall is far superior. Only spot-seed if areas are too bare to wait. Keep moist 2–3× daily until germination. Note: cannot overseed after pre-emergent is applied.' },
      { title: 'Begin mowing cool-season', category: 'mow',  priority: 'medium', description: 'Start mowing fescue at 3.5 inches when growth resumes and grass reaches 4.5–5 inches. Avoid scalping dormant turf.' },
    ],
    // April
    [
      { title: 'First warm-season fertilizer', category: 'fertilize', priority: 'high', description: 'Fertilize Bermuda and Zoysia once 50% of the lawn has greened up (typically late April in KC). Apply 0.5–1 lb N/1,000 sqft slow-release. Feeding dormant turf wastes product and feeds weeds.' },
      { title: 'Adjust mow heights by type', category: 'mow', priority: 'high',  description: 'Bermuda/Zoysia: 1–1.5 inches once actively growing. Tall fescue: 3–3.5 inches. Differentiated heights are critical—one pass height damages one grass or the other.' },
      { title: 'Broadleaf weed control', category: 'weed',   priority: 'medium', description: 'Apply broadleaf herbicide (2,4-D, triclopyr, or three-way mix) when weeds are actively growing and temps are 55–85 °F. Avoid spraying above 85 °F to prevent volatilization and turf damage.' },
      { title: 'Irrigation startup',    category: 'water',   priority: 'medium', description: 'Open irrigation system; inspect heads and lines for winter damage. Set controller for 1 inch/week split across 2–3 runs in early morning.' },
    ],
    // May
    [
      { title: 'Warm-season fertilize', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to Bermuda/Zoysia as they enter full active growth. Use slow-release (IBDU or polymer-coated urea) for 6–8 week feeding. Never exceed 1 lb N per 1,000 sqft per application.' },
      { title: 'Grub preventive window', category: 'pest',  priority: 'high',   description: 'Apply chlorantraniliprole (Acelepryn) in May for the longest pre-egg protection window, or imidacloprid (Merit) by early June before eggs hatch. Water in with 0.5 inch irrigation immediately.' },
      { title: 'Fescue heat prep',      category: 'water',   priority: 'medium', description: 'Tall fescue begins heat stress when KC daytime temps consistently exceed 85 °F. Raise mowing height to 4 inches now and increase irrigation to 1.5 inches/week to extend its active season.' },
      { title: 'Second pre-emergent (optional)', category: 'weed', priority: 'low', description: 'A second pre-emergent application 6–8 weeks after the first extends crabgrass barrier into summer. Particularly valuable in high-pressure years or when first application timing was late.' },
    ],
    // June
    [
      { title: 'Warm-season peak feeding', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to Bermuda/Zoysia—peak growing season; turf processes nutrients efficiently. Hold all nitrogen on tall fescue; feeding stressed cool-season grass in June invites disease.' },
      { title: 'Differentiate watering', category: 'water',  priority: 'high',   description: 'Bermuda: 1 in/week. Zoysia: 0.75 in/week. Fescue: 1.5 in/week minimum (drought-stressed). All irrigation in 5–9 AM window only. Evening watering triggers brown patch on fescue.' },
      { title: 'Watch for brown patch on fescue', category: 'pest', priority: 'medium', description: 'Hot days + humid nights = prime brown patch conditions in KC June. Circular tan patches with darker border are diagnostic. Apply azoxystrobin or propiconazole fungicide preventively if conditions persist.' },
    ],
    // July
    [
      { title: 'Warm-season mid-summer fertilize', category: 'fertilize', priority: 'high', description: 'Apply 0.5–1 lb N/1,000 sqft to Bermuda/Zoysia. KC July heat suits warm-season grasses; they use nitrogen efficiently now. Skip completely for fescue—no exceptions.' },
      { title: 'Fescue managed dormancy', category: 'water', priority: 'high',  description: 'Allow tall fescue to go semi-dormant if water is limited. Maintain a consistent 0.5 inch/week minimum—irregular watering stresses turf more than sustained dormancy. Full recovery returns in September cool weather.' },
      { title: 'Aerate warm-season grass', category: 'aerate', priority: 'medium', description: 'Core aerate Bermuda and Zoysia in peak summer growth for rapid recovery and thatch reduction. Two passes on clay soils. Skip for fescue—summer aeration stresses cool-season grass.' },
      { title: 'Spot weed only',         category: 'weed',   priority: 'low',    description: 'Limit herbicide to spot-treatment only when temps exceed 85 °F. Broadcast applications risk turf burn. Mark persistent weeds for fall post-emergent treatment instead.' },
    ],
    // August
    [
      { title: 'Final warm-season fertilize', category: 'fertilize', priority: 'high', description: 'Last summer feeding for Bermuda/Zoysia. In KC Zone 6a, first average frost is mid-October—stop nitrogen 6–8 weeks prior (by end of August) to prevent tender growth that\'s susceptible to freeze damage.' },
      { title: 'Core aerate for fall overseeding', category: 'aerate', priority: 'high', description: 'Aerate compacted fescue areas in late August before fall seeding. Two passes on heavy clay. Aeration holes provide 40–60% better seed germination than broadcast seeding alone—do not skip this step.' },
      { title: 'Fescue overseeding prep (mid-Aug)', category: 'seed', priority: 'high', description: 'Prime KC window: Aug 15–Sep 15. Grade low spots, rake thatch over 0.5 inch, verify pH 6.0–6.5. Rent a slit seeder for large renovations—slit seeding dramatically outperforms broadcast seeding in germination rate and density.' },
      { title: 'Grub curative check',    category: 'pest',   priority: 'medium', description: 'Check turf for grub damage: spongy areas, turf that lifts like carpet, or increased bird/skunk digging. Apply trichlorfon or carbaryl (curative) if more than 5 grubs per square foot are present.' },
    ],
    // September
    [
      { title: 'Overseed tall fescue — prime KC window', category: 'seed', priority: 'high', description: 'Best window for tall fescue overseeding in KC Zone 6a: soil 65–75 °F (soil cools behind air temps). Slit seed at 6 lbs/1,000 sqft (overseeding) or 9 lbs/1,000 sqft (full renovation). Slit seeding gives 40–60% better germination than broadcast. Water 2–3× daily until germination (7–14 days for tall fescue).' },
      { title: 'Cool-season fall fertilize', category: 'fertilize', priority: 'high', description: 'Apply 1 lb N/1,000 sqft to fescue lawns. Fall is the highest-value fertilizer window for cool-season grass. Avoid fertilizing warm-season grasses—they are transitioning to dormancy.' },
      { title: 'Broadleaf weed control', category: 'weed',   priority: 'high',   description: 'Prime fall broadleaf window: weeds translocate herbicide to roots, giving the deepest kill. Use three-way mix (2,4-D + MCPP + dicamba) or triclopyr for tough species like wild violet and ground ivy.' },
    ],
    // October
    [
      { title: 'Winterizer fertilizer (before Nov 1)', category: 'fertilize', priority: 'high', description: 'Apply high-K winterizer (24-0-12 or similar) to tall fescue before Oct 31—Johnson County fertilizer blackout begins Nov 1. October is the single highest-value fertilizer application for cool-season lawns. Builds root carbohydrate reserves for winter survival and spring green-up density.' },
      { title: 'Leaf management',        category: 'cleanup', priority: 'high',   description: 'Remove or mulch-mow leaves at least weekly. KC\'s oak and maple canopies can bury turf quickly. A mat of leaves for more than 7 days blocks sunlight and promotes snow mold and disease. Bag heavy accumulations; mulch-mow light coverage.' },
      { title: 'Winterize irrigation',  category: 'water',   priority: 'high',   description: 'Schedule irrigation winterization before the first hard freeze (28 °F sustained). KC average first frost is October 13–17. Blow out all lines; standing water in backflow preventers and valve bodies cracks components.' },
      { title: 'Final broadleaf herbicide', category: 'weed', priority: 'medium', description: 'Last effective window for broadleaf control before soil temps fall below 50 °F. Treat dandelions, clover, and wild violet now—they\'re actively transporting nutrients to roots and will pull herbicide deep.' },
    ],
    // November
    [
      { title: 'Fertilizer blackout begins Nov 1', category: 'fertilize', priority: 'high', description: 'Johnson County, KS fertilizer blackout runs Nov 1–Mar 1. No applications during this period. Check your municipality—many KC metro cities have similar ordinances with fines for violations.' },
      { title: 'Final mow at 3 inches', category: 'mow',     priority: 'high',   description: 'Final mow for tall fescue at 3 inches before growth stops. Too long (>4") creates matting and snow mold risk; too short (<2.5") stresses roots and reduces winter hardiness.' },
      { title: 'Cleanup and winterize equipment', category: 'cleanup', priority: 'medium', description: 'Clear all leaf litter before snowfall. Drain or stabilize mower fuel, clean mower deck, lubricate moving parts, and store in frost-free location.' },
    ],
    // December
    [
      { title: 'Fertilizer blackout in effect', category: 'fertilize', priority: 'high', description: 'Johnson County, KS fertilizer blackout continues through February 28. Plan your March applications—slow-release formulas and soil test results should be ready to go when the blackout lifts March 1.' },
      { title: 'Dormant weed scouting', category: 'weed',   priority: 'low',    description: 'Note Poa annua, chickweed, and henbit pressure for January spot-treatment planning. These cool-season weeds grow actively through KC winters in mild spells.' },
      { title: 'Plan next season',      category: 'cleanup', priority: 'low',    description: 'Order tall fescue seed (certified varieties: Titan, Falcon, or Crossfire), pre-emergent, and slow-release fertilizer before February price increases. Review irrigation system performance notes.' },
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
