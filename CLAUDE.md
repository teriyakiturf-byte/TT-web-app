# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint across all .js/.jsx files
```

## Architecture

Single-page React app (Vite + Tailwind CSS + Lucide React). No router — tab state is managed with `useState` in `App.jsx`. All user data persists via `localStorage` using the `useLocalStorage` hook.

### Tab layout

| Tab | Component | Description |
|---|---|---|
| Dashboard | `ZoneLookup` + `WeatherWidget` + `LawnIntelligence` | ZIP→zone lookup, live weather, rule-based tips |
| Calculator | `ProductCalculator` | Grass seed / fertilizer / mulch / pre-emergent formulas |
| Calendar | `LawnCalendar` | 12-month schedule, filterable by category |
| Tasks & Notes | `TodoList` + `Notes` | Seasonal chore checklist + freeform notes |

### Key files

- `src/App.jsx` — root state, localStorage keys (`tt_zipCode`, `tt_zone`, `tt_owm_key`, `tt_sqft`, `tt_todos`, `tt_notes`), weather fetch orchestration
- `src/hooks/useLocalStorage.js` — generic hook; reads on mount, writes on change
- `src/utils/calendarData.js` — full 12-month × 3-zone calendar data, `getZoneGroup()` helper, category color map
- `src/utils/lawnIntelligence.js` — `generateTips()` rules engine; takes OWM weather payload + USDA zone string + month index
- `src/utils/productCalculator.js` — pure functions for seed, fertilizer, mulch, pre-emergent calculations
- `src/index.css` — Tailwind directives + reusable component classes (`.card`, `.btn-primary`, `.input`, `.tip-warning`, etc.)

### External APIs

| API | Endpoint pattern | Auth |
|---|---|---|
| USDA Plant Hardiness Zone | `https://phzmapi.org/{zip}.json` | None |
| OpenWeatherMap current | `https://api.openweathermap.org/data/2.5/weather?zip={zip},us&appid={key}` | Free API key (user-supplied, stored in localStorage) |
| OpenWeatherMap forecast | `https://api.openweathermap.org/data/2.5/forecast?zip={zip},us&appid={key}` | Same key |

OWM returns temperatures in Kelvin — convert with `kelvinToF(k) = Math.round((k - 273.15) * 9/5 + 32)` in `WeatherWidget.jsx`.

### Zone group logic

`getZoneGroup(zone)` in `calendarData.js` maps a USDA zone string (e.g. `"7b"`) to one of three groups used throughout the app:

| Group | USDA Zones | Grass types |
|---|---|---|
| `north` | 3–5 | Kentucky Blue, Fescue, Ryegrass |
| `transition` | 6–7 | Tall Fescue, Zoysia/Bermuda mix |
| `south` | 8–10 | Bermuda, Zoysia, St. Augustine |

### Lawn Intelligence rules engine

`generateTips(weather, zone, monthIndex)` in `lawnIntelligence.js` returns an array of `{ type, icon, title, body }` objects. Rules are grouped:

1. **Weather-based** — rain in forecast (24 h window), temp extremes (<40 °F, >90 °F), high wind (>15 mph), low humidity drought watch, thunderstorm, fungal disease conditions
2. **Season-based** — pre-emergent reminder (spring), raise mowing height (summer), aerate & overseed prompt (fall), leaf management (Oct/Nov), protect dormant turf (winter)
3. **Zone-specific** — cool-season summer dormancy tips (north), ryegrass overseeding window (south fall), transition zone dual-grass advice

### Product calculator formulas (src/utils/productCalculator.js)

- **Grass seed**: `lbsNeeded = (sqft / 1000) × rate` where rate varies by grass type and scenario (new lawn vs. overseeding)
- **Fertilizer**: `lbsOfProduct = ((sqft / 1000) × targetLbsN) / (nPercent / 100)` — standard target is 1 lb N per 1,000 sqft
- **Mulch**: `cubicFeet = (sqft × depthInches) / 12`; `bagsNeeded = Math.ceil(cubicFeet / 2)` (standard 2-cu-ft bags)
- **Pre-emergent**: `lbsNeeded = (sqft / 1000) × ratePerThousand` (default 2.87 lb/1,000 sqft)

### Styling conventions

Tailwind custom color scales added in `tailwind.config.js`:
- `lawn-*` — green shades (primary UI color)
- `earth-*` — amber/ochre shades (accents, calculator)

Reusable classes defined in `src/index.css`: `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.label`, `.section-title`, `.tip-warning`, `.tip-info`, `.tip-success`.
