import { useState } from 'react'
import { MapPin, Loader2, Info } from 'lucide-react'
import { ZONE_GROUPS, getZoneGroup } from '../utils/calendarData.js'

const ZONE_COLORS = {
  north:      'bg-tt-light-lime border-tt-lime text-tt-forest',
  transition: 'bg-tt-light-orange border-tt-orange/60 text-tt-charcoal',
  south:      'bg-[#fff0ea] border-tt-orange text-tt-charcoal',
}

export default function ZoneLookup({ zipCode, onZipChange, zone, onZoneChange }) {
  const [input, setInput] = useState(zipCode || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLookup(e) {
    e.preventDefault()
    const zip = input.trim()
    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`https://phzmapi.org/${zip}.json`)
      if (!res.ok) throw new Error('ZIP not found')
      const data = await res.json()
      const fetchedZone = data.zone
      if (!fetchedZone) throw new Error('Zone data unavailable for this ZIP')
      onZipChange(zip)
      onZoneChange(fetchedZone)
    } catch (err) {
      setError(err.message || 'Failed to look up zone. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const zoneGroup = getZoneGroup(zone)
  const zoneInfo = zoneGroup ? ZONE_GROUPS[zoneGroup] : null

  return (
    <div className="card">
      <h2 className="section-title">
        <MapPin className="w-5 h-5 text-tt-orange" />
        Location & Growing Zone
      </h2>

      <form onSubmit={handleLookup} className="flex gap-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter ZIP code"
          className="input flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5 whitespace-nowrap">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          Look Up
        </button>
      </form>

      {error && (
        <p className="text-tt-orange text-sm flex items-center gap-1.5 mb-2 font-semibold">
          <Info className="w-4 h-4 flex-shrink-0" /> {error}
        </p>
      )}

      {zone && zoneInfo && (
        <div className={`rounded-xl border-2 px-4 py-3 ${ZONE_COLORS[zoneGroup]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Your USDA Zone</p>
              <p className="text-3xl font-extrabold leading-tight mt-0.5">{zone}</p>
              <p className="text-sm font-semibold mt-0.5">{zoneInfo.label}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold">ZIP: {zipCode}</p>
              <p className="mt-1">{zoneInfo.grasses}</p>
            </div>
          </div>
        </div>
      )}

      {!zone && (
        <p className="text-tt-charcoal/40 text-sm text-center py-2">
          Enter your ZIP code to personalize your lawn care plan.
        </p>
      )}
    </div>
  )
}
