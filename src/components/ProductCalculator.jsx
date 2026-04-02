import { useState } from 'react'
import { Calculator, Sprout, Zap, Package, Leaf, Scissors } from 'lucide-react'
import {
  GRASS_SEED_RATES,
  MOWING_HEIGHTS,
  calculateGrassSeed,
  calculateFertilizer,
  calculateMulch,
  calculatePreEmergent,
} from '../utils/productCalculator.js'

const TABS = [
  { id: 'seed',        label: 'Grass Seed',  Icon: Sprout },
  { id: 'fertilizer', label: 'Fertilizer',   Icon: Zap },
  { id: 'mulch',      label: 'Mulch',        Icon: Package },
  { id: 'preemergent',label: 'Pre-Emergent', Icon: Leaf },
  { id: 'mowing',     label: 'Mow Heights',  Icon: Scissors },
]

function ResultCard({ label, value, unit, note }) {
  return (
    <div className="bg-tt-light-lime border border-tt-lime/50 rounded-xl p-4 text-center">
      <p className="text-xs font-bold text-tt-forest/60 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-tt-forest">
        {value}
        <span className="text-lg ml-1 font-semibold text-tt-forest/60">{unit}</span>
      </p>
      {note && <p className="text-xs text-tt-forest/50 mt-1">{note}</p>}
    </div>
  )
}

export default function ProductCalculator({ sqFootage, onSqFootageChange }) {
  const [activeTab, setActiveTab] = useState('seed')

  const [grassType, setGrassType] = useState('tall_fescue')
  const [scenario, setScenario] = useState('overseeding')
  const [nPercent, setNPercent] = useState(30)
  const [targetN, setTargetN] = useState(1.0)
  const [mulchDepth, setMulchDepth] = useState(3)
  const [preRate, setPreRate] = useState(2.87)

  const sqft = parseFloat(sqFootage) || 0

  const seedResult  = sqft > 0 ? calculateGrassSeed(sqft, grassType, scenario) : null
  const fertResult  = sqft > 0 ? calculateFertilizer(sqft, parseFloat(nPercent), parseFloat(targetN)) : null
  const mulchResult = sqft > 0 ? calculateMulch(sqft, parseFloat(mulchDepth)) : null
  const preResult   = sqft > 0 ? calculatePreEmergent(sqft, parseFloat(preRate)) : null

  return (
    <div className="card">
      <h2 className="section-title">
        <Calculator className="w-5 h-5 text-tt-orange" />
        Product Calculator
      </h2>

      {/* Lawn size input — hidden for mowing tab */}
      {activeTab !== 'mowing' && (
        <div className="mb-5">
          <label className="label">Lawn Square Footage</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              value={sqFootage}
              onChange={e => onSqFootageChange(e.target.value)}
              placeholder="e.g. 5000"
              className="input w-48"
            />
            <span className="text-tt-charcoal/60 font-semibold">sq ft</span>
            {sqft > 0 && (
              <span className="text-tt-charcoal/40 text-sm">≈ {(sqft / 43560).toFixed(2)} acres</span>
            )}
          </div>
          {!sqft && (
            <p className="text-xs text-tt-charcoal/40 mt-1">
              Tip: multiply length × width to estimate, or use Google Maps area tool.
            </p>
          )}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-tt-cream p-1 rounded-xl border border-tt-lime/20">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150
              ${activeTab === id
                ? 'bg-tt-forest text-tt-cream shadow'
                : 'text-tt-charcoal/50 hover:text-tt-charcoal'}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden" style={{fontSize:'10px'}}>{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* ── Grass Seed ── */}
      {activeTab === 'seed' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Grass Type</label>
              <select className="input" value={grassType} onChange={e => setGrassType(e.target.value)}>
                <optgroup label="Cool Season">
                  {Object.entries(GRASS_SEED_RATES)
                    .filter(([,v]) => v.season.startsWith('Cool'))
                    .map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                </optgroup>
                <optgroup label="Warm Season">
                  {Object.entries(GRASS_SEED_RATES)
                    .filter(([,v]) => v.season.startsWith('Warm'))
                    .map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="label">Application</label>
              <select className="input" value={scenario} onChange={e => setScenario(e.target.value)}>
                <option value="new_lawn">New Lawn / Full Renovation</option>
                <option value="overseeding">Overseeding (existing turf)</option>
              </select>
            </div>
          </div>

          {seedResult && sqft > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="Seed Needed" value={seedResult.lbsNeeded} unit="lbs" />
                <ResultCard label="Coverage Rate" value={seedResult.rate} unit="lbs/1k sqft"
                  note={scenario === 'overseeding' ? 'Overseeding rate' : 'Renovation rate'} />
              </div>
              {seedResult.note && (
                <div className="tip-info text-xs">
                  <strong>{GRASS_SEED_RATES[grassType]?.label}:</strong> {seedResult.note}
                </div>
              )}
            </>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter lawn square footage above to calculate.</p>
          )}

          <div className="tip-warning text-xs">
            <strong>Best practice:</strong> Slit seeding gives 40–60% better germination than broadcast — consider renting a slit seeder ($75–100/day) for large areas. Keep seed moist with 2–3 light waterings daily until germination, then transition to deep/infrequent irrigation.
          </div>
        </div>
      )}

      {/* ── Fertilizer ── */}
      {activeTab === 'fertilizer' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nitrogen % (N-P-K first number)</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="50" value={nPercent}
                  onChange={e => setNPercent(e.target.value)} className="input" placeholder="e.g. 30" />
                <span className="text-tt-charcoal/50">%</span>
              </div>
              <p className="text-xs text-tt-charcoal/40 mt-1">E.g. "30" from a 30-0-4 bag label</p>
            </div>
            <div>
              <label className="label">Target N Rate (lbs/1k sqft)</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0.25" max="3" step="0.25" value={targetN}
                  onChange={e => setTargetN(e.target.value)} className="input" />
                <span className="text-tt-charcoal/50 text-sm">lb N</span>
              </div>
              <p className="text-xs text-tt-charcoal/40 mt-1">Standard: 1 lb N / 1,000 sqft. Never exceed this in one application.</p>
            </div>
          </div>

          {fertResult && sqft > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              <ResultCard label="Product to Apply" value={fertResult.lbsOfProduct} unit="lbs total" />
              <ResultCard label="Per 1,000 sqft" value={fertResult.per1000sqft} unit="lbs" note="Spreader calibration" />
              <ResultCard label="Actual N Delivered" value={fertResult.totalLbsN} unit="lbs N" />
            </div>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter your lawn size and N% to calculate.</p>
          )}

          <div className="tip-warning text-xs">
            <strong>Rule:</strong> Never exceed 1 lb actual N per 1,000 sqft per application — more causes fertilizer burn and water contamination. Apply when grass is dry, rain isn't expected for 24 hours, and temps are below 85°F.
          </div>
        </div>
      )}

      {/* ── Mulch ── */}
      {activeTab === 'mulch' && (
        <div className="space-y-4">
          <div>
            <label className="label">Desired Mulch Depth</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(d => (
                <button
                  key={d}
                  onClick={() => setMulchDepth(d)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border-2 transition-colors
                    ${mulchDepth === d
                      ? 'bg-tt-orange border-tt-orange text-tt-cream'
                      : 'border-tt-lime/40 text-tt-charcoal/60 hover:border-tt-orange/60'}`}
                >
                  {d}"
                </button>
              ))}
            </div>
            <p className="text-xs text-tt-charcoal/40 mt-1">Standard: 2–3 inches. Never pile against tree trunks or plant stems.</p>
          </div>

          {mulchResult && sqft > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <ResultCard label="Cubic Yards" value={mulchResult.cubicYards} unit="cu yd" note="For bulk delivery" />
                <ResultCard label="Cubic Feet" value={mulchResult.cubicFeet} unit="cu ft" />
                <ResultCard label="Bags Needed" value={mulchResult.bagsNeeded} unit="bags" note="Standard 2-cu-ft bags" />
              </div>
              {mulchResult.warning && (
                <div className="tip-warning text-xs">{mulchResult.warning}</div>
              )}
            </>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter bed/area square footage above to calculate.</p>
          )}

          <div className="tip-info text-xs">
            <strong>Tip:</strong> Keep mulch 2–3" away from plant stems and tree trunks to prevent crown rot and rodent damage. Refresh annually at 1–2" rather than adding thick new layers on top of old mulch.
          </div>
        </div>
      )}

      {/* ── Pre-Emergent ── */}
      {activeTab === 'preemergent' && (
        <div className="space-y-4">
          <div>
            <label className="label">Product Rate (lbs per 1,000 sqft)</label>
            <div className="flex items-center gap-3">
              <input type="number" min="1" max="6" step="0.1" value={preRate}
                onChange={e => setPreRate(e.target.value)} className="input w-36" />
              <span className="text-tt-charcoal/50 text-sm">lbs / 1k sqft</span>
            </div>
            <p className="text-xs text-tt-charcoal/40 mt-1">
              Pendimethalin: 2.3–4.6 lbs · Prodiamine: 1.5–2.5 lbs · Dithiopyr: 1.8–2.8 lbs. Always confirm your label.
            </p>
          </div>

          {preResult && sqft > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Product Needed" value={preResult.lbsNeeded} unit="lbs" />
              <ResultCard label="Application Rate" value={preResult.ratePerThousand} unit="lbs/1k sqft" note="Per product label" />
            </div>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter your lawn size above to calculate.</p>
          )}

          <div className="tip-info text-xs">
            <strong>Timing:</strong> Apply when soil temp at 2" reaches 50°F (forsythia full bloom = natural indicator). A second application 6–8 weeks later extends the barrier. Do not overseed for 8–12 weeks after pendimethalin or prodiamine; dithiopyr (Dimension) offers more flexibility.
          </div>
        </div>
      )}

      {/* ── Mowing Heights Reference ── */}
      {activeTab === 'mowing' && (
        <div className="space-y-4">
          <p className="text-sm text-tt-charcoal/60">
            Reference mowing heights by grass type. <strong className="text-tt-forest">The 1/3 rule:</strong> never remove more than 1/3 of the blade in a single cut — mow when grass is 50% taller than target height.
          </p>

          {/* Cool Season */}
          <div>
            <p className="text-xs font-bold text-tt-forest/60 uppercase tracking-widest mb-2">Cool Season Grasses</p>
            <div className="space-y-2">
              {Object.entries(MOWING_HEIGHTS)
                .filter(([,v]) => v.season === 'Cool Season')
                .map(([key, val]) => (
                  <div key={key} className="bg-tt-light-lime border border-tt-lime/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-tt-forest text-sm">{val.label}</span>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-xs text-tt-charcoal/50">Normal</span>
                        <span className="font-extrabold text-tt-forest">{val.min}–{val.max}"</span>
                        <span className="text-xs text-tt-charcoal/50">Summer</span>
                        <span className="font-bold text-tt-orange">{val.summer}</span>
                      </div>
                    </div>
                    <p className="text-xs text-tt-charcoal/60">{val.note}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Warm Season */}
          <div>
            <p className="text-xs font-bold text-tt-forest/60 uppercase tracking-widest mb-2">Warm Season Grasses</p>
            <div className="space-y-2">
              {Object.entries(MOWING_HEIGHTS)
                .filter(([,v]) => v.season === 'Warm Season')
                .map(([key, val]) => (
                  <div key={key} className="bg-tt-light-orange border border-tt-orange/20 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-tt-charcoal text-sm">{val.label}</span>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-xs text-tt-charcoal/50">Normal</span>
                        <span className="font-extrabold text-tt-charcoal">{val.min}–{val.max}"</span>
                        <span className="text-xs text-tt-charcoal/50">Peak</span>
                        <span className="font-bold text-tt-orange">{val.summer}</span>
                      </div>
                    </div>
                    <p className="text-xs text-tt-charcoal/60">{val.note}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="tip-warning text-xs">
            <strong>Common mistake:</strong> Mowing the same pattern every session compacts soil into ruts. Alternate direction (diagonal, perpendicular) each mow and sharpen blades every 25 hours of use — dull blades tear grass, opening it to disease.
          </div>
        </div>
      )}
    </div>
  )
}
