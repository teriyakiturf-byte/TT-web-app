import { useState } from 'react'
import { Calculator, Sprout, Zap, Package, Leaf } from 'lucide-react'
import {
  GRASS_SEED_RATES,
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

  const seedResult = sqft > 0 ? calculateGrassSeed(sqft, grassType, scenario) : null
  const fertResult = sqft > 0 ? calculateFertilizer(sqft, parseFloat(nPercent), parseFloat(targetN)) : null
  const mulchResult = sqft > 0 ? calculateMulch(sqft, parseFloat(mulchDepth)) : null
  const preResult = sqft > 0 ? calculatePreEmergent(sqft, parseFloat(preRate)) : null

  return (
    <div className="card">
      <h2 className="section-title">
        <Calculator className="w-5 h-5 text-tt-orange" />
        Product Calculator
      </h2>

      {/* Lawn size input */}
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

      {/* Product tabs */}
      <div className="flex gap-1 mb-5 bg-tt-cream p-1 rounded-xl border border-tt-lime/20">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150
              ${activeTab === id
                ? 'bg-tt-forest text-tt-cream shadow'
                : 'text-tt-charcoal/50 hover:text-tt-charcoal'}`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
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
                {Object.entries(GRASS_SEED_RATES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label} ({val.season})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Application</label>
              <select className="input" value={scenario} onChange={e => setScenario(e.target.value)}>
                <option value="new_lawn">New Lawn</option>
                <option value="overseeding">Overseeding</option>
              </select>
            </div>
          </div>

          {seedResult && sqft > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Seed Needed" value={seedResult.lbsNeeded} unit="lbs" />
              <ResultCard label="Coverage Rate" value={seedResult.rate} unit="lbs/1k sqft"
                note={scenario === 'overseeding' ? 'Overseeding rate' : 'New lawn rate'} />
            </div>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter lawn square footage above to calculate.</p>
          )}

          <div className="tip-warning text-xs">
            <strong>Tip:</strong> Seed on a calm day when temps are 60–75°F. Keep soil consistently moist for the first 2–3 weeks until germination is complete.
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
              <p className="text-xs text-tt-charcoal/40 mt-1">Standard is 1 lb N / 1,000 sqft</p>
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
            <strong>Tip:</strong> Apply when grass is dry and rain isn't expected for 24 hours. Water lightly after application to move granules off blades.
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
            <p className="text-xs text-tt-charcoal/40 mt-1">Standard: 2–3 inches. Never pile against tree trunks.</p>
          </div>

          {mulchResult && sqft > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              <ResultCard label="Cubic Yards" value={mulchResult.cubicYards} unit="cu yd" note="For bulk delivery" />
              <ResultCard label="Cubic Feet" value={mulchResult.cubicFeet} unit="cu ft" />
              <ResultCard label="Bags Needed" value={mulchResult.bagsNeeded} unit="bags" note="Standard 2-cu-ft bags" />
            </div>
          ) : (
            <p className="text-tt-charcoal/40 text-sm text-center py-3">Enter bed/area square footage above to calculate.</p>
          )}

          <div className="tip-info text-xs">
            <strong>Tip:</strong> Keep mulch 2–3 inches away from plant stems and tree trunks to prevent rot and rodent damage.
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
              Typical granular range: 2.5–3.25 lbs/1,000 sqft. Always check your product label.
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
            <strong>Timing:</strong> Apply when soil temperature at 2-inch depth reaches 50°F in early spring. A second application 6–8 weeks later extends the barrier.
          </div>
        </div>
      )}
    </div>
  )
}
