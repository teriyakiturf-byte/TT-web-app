import { useState } from 'react'
import { MapPin, Loader2, Info } from 'lucide-react'
import { ZONE_GROUPS, getZoneGroup } from '../utils/calendarData.js'

const ZONE_COLORS = {
  north:      'bg-sky-50 border-sky-300 text-sky-900',
  transition: 'bg-amber-50 border-amber-300 text-amber-900',
  south:      'bg-red-50 border-red-300 text-red-900',
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
        <MapPin className="w-5 h-5 text-lawn-600" />
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
        <p className="text-red-600 text-sm flex items-center gap-1.5 mb-2">
          <Info className="w-4 h-4 flex-shrink-0" /> {error}
        </p>
      )}

      {zone && zoneInfo && (
        <div className={`rounded-xl border px-4 py-3 ${ZONE_COLORS[zoneGroup]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Your USDA Zone</p>
              <p className="text-3xl font-extrabold leading-tight mt-0.5">{zone}</p>
              <p className="text-sm font-semibold mt-0.5">{zoneInfo.label}</p>
            </div>
            <div className="text-right text-xs opacity-80">
              <p className="font-semibold">ZIP: {zipCode}</p>
              <p className="mt-1">{zoneInfo.grasses}</p>
            </div>
          </div>
        </div>
      )}

      {!zone && (
        <p className="text-stone-400 text-sm text-center py-2">
          Enter your ZIP code to personalize your lawn care plan.
        </p>
      )}
    </div>
  )
}
