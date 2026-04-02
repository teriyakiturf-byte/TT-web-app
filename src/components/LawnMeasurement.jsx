import { useState, useEffect, useRef } from 'react'
import { MapPin, RotateCcw, Save, Ruler, Trash2, Check, Map, Navigation, Package } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// !! Replace with your actual Google Maps JavaScript API key !!
// Enable: Maps JavaScript API + Geometry library + Geocoding API
// Get a key at: https://console.cloud.google.com/
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"

const SQ_METERS_TO_SQ_FEET = 10.7639
const KC_CENTER = { lat: 39.0997, lng: -94.5786 }

function ProductQtyRow({ label, qty }) {
  return (
    <div className="flex justify-between items-center bg-tt-light-lime/60 rounded-xl px-3 py-2.5">
      <span className="text-xs text-tt-charcoal/80">{label}</span>
      <span className="font-bold text-tt-forest text-sm ml-2 flex-shrink-0">
        {qty} bag{qty !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

function SavedMeasurements({ measurements, onDelete }) {
  const total = measurements.reduce((sum, m) => sum + m.sqft, 0)
  return (
    <div className="card">
      <h3 className="section-title">
        <Save className="w-5 h-5 text-tt-orange" />
        Saved Measurements
      </h3>
      <div className="space-y-2">
        {measurements.map(m => (
          <div key={m.id} className="flex items-center justify-between gap-3 bg-tt-light-lime/50 rounded-xl px-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-tt-forest text-sm truncate">{m.label}</p>
              <p className="text-xs text-tt-charcoal/50">{m.date}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <p className="font-bold text-tt-forest">
                {m.sqft.toLocaleString()}
                <span className="text-xs font-normal text-tt-charcoal/50 ml-1">sq ft</span>
              </p>
              <button onClick={() => onDelete(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
        {measurements.length > 1 && (
          <div className="flex justify-between items-center px-4 py-2.5 border-t border-tt-lime/20 mt-1">
            <span className="text-sm font-semibold text-tt-charcoal/60">Total (all areas)</span>
            <span className="font-bold text-tt-forest">{total.toLocaleString()} sq ft</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LawnMeasurement() {
  const [measurements, setMeasurements] = useLocalStorage('tt_measurements', [])
  const [area, setArea] = useState(0)
  const [pointCount, setPointCount] = useState(0)
  const [isClosed, setIsClosed] = useState(false)
  const [saveLabel, setSaveLabel] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [mapError, setMapError] = useState(null)

  const mapDivRef = useRef(null)
  const mapRef = useRef(null)
  const geocoderRef = useRef(null)
  const markersRef = useRef([])
  const polylineRef = useRef(null)
  const polygonRef = useRef(null)
  const pointsRef = useRef([])
  const isClosedRef = useRef(false)

  // Load Google Maps API
  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE' || !GOOGLE_MAPS_API_KEY) {
      setMapError('no-key')
      return
    }
    if (window.google?.maps) { setMapsLoaded(true); return }
    const cbName = '__gmInit_' + Date.now()
    window[cbName] = () => { setMapsLoaded(true); delete window[cbName] }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,places&callback=${cbName}`
    script.async = true
    script.defer = true
    script.onerror = () => setMapError('load-failed')
    document.head.appendChild(script)
    return () => { if (document.head.contains(script)) document.head.removeChild(script) }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapDivRef.current || mapRef.current) return
    const map = new window.google.maps.Map(mapDivRef.current, {
      center: KC_CENTER,
      zoom: 17,
      mapTypeId: 'satellite',
      tilt: 0,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })
    geocoderRef.current = new window.google.maps.Geocoder()
    map.addListener('click', (e) => {
      if (isClosedRef.current) return
      const latLng = e.latLng
      const newPoints = [...pointsRef.current, latLng]
      pointsRef.current = newPoints
      const marker = new window.google.maps.Marker({
        position: latLng, map,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#FF6B35', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 },
        zIndex: 10,
      })
      markersRef.current.push(marker)
      if (polylineRef.current) polylineRef.current.setMap(null)
      if (newPoints.length > 1) {
        polylineRef.current = new window.google.maps.Polyline({
          path: newPoints, geodesic: true, strokeColor: '#FF6B35', strokeOpacity: 0.85, strokeWeight: 2.5, map,
        })
      }
      if (newPoints.length >= 3) {
        const sqm = window.google.maps.geometry.spherical.computeArea(newPoints)
        setArea(Math.round(sqm * SQ_METERS_TO_SQ_FEET))
      }
      setPointCount(newPoints.length)
    })
    mapRef.current = map
  }, [mapsLoaded])

  function closePolygon() {
    const pts = pointsRef.current
    if (pts.length < 3) return
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null }
    polygonRef.current = new window.google.maps.Polygon({
      paths: pts, strokeColor: '#FF6B35', strokeOpacity: 0.9, strokeWeight: 2.5,
      fillColor: '#95D5B2', fillOpacity: 0.35, map: mapRef.current,
    })
    const sqm = window.google.maps.geometry.spherical.computeArea(pts)
    setArea(Math.round(sqm * SQ_METERS_TO_SQ_FEET))
    isClosedRef.current = true
    setIsClosed(true)
  }

  function resetDrawing() {
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null }
    if (polygonRef.current) { polygonRef.current.setMap(null); polygonRef.current = null }
    pointsRef.current = []
    isClosedRef.current = false
    setPointCount(0); setArea(0); setIsClosed(false); setSaveLabel('')
  }

  function searchAddress() {
    if (!geocoderRef.current || !addressInput.trim()) return
    const query = /KS|MO|Kansas City/i.test(addressInput) ? addressInput : addressInput + ', Kansas City, KS'
    geocoderRef.current.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results[0]) {
        mapRef.current.setCenter(results[0].geometry.location)
        mapRef.current.setZoom(19)
      }
    })
  }

  function saveMeasurement() {
    if (!area || !saveLabel.trim()) return
    setMeasurements([
      { id: 'm_' + Date.now(), label: saveLabel.trim(), sqft: area, date: new Date().toLocaleDateString() },
      ...measurements,
    ])
    setSaveLabel('')
    resetDrawing()
  }

  const recommendations = area > 0 ? [
    { label: 'Fertilizer bags (5,000 sq ft each)', qty: Math.ceil(area / 5000) },
    { label: 'Grass seed bags — overseeding (3,000 sq ft/bag)', qty: Math.ceil(area / 3000) },
    { label: 'Pre-emergent bags (5,000 sq ft each)', qty: Math.ceil(area / 5000) },
    { label: 'Mulch bags at 2-inch depth (2 cu ft bags)', qty: Math.ceil((area * 2 / 12) / 2) },
  ] : []

  if (mapError === 'no-key') {
    return (
      <div className="space-y-5">
        <div className="card text-center py-14">
          <Map className="w-14 h-14 text-tt-lime mx-auto mb-4 opacity-60" />
          <h2 className="text-xl font-bold text-tt-forest mb-2">Lawn Measurement Tool</h2>
          <p className="text-tt-charcoal/70 mb-5 max-w-md mx-auto text-sm leading-relaxed">
            This tool uses Google Maps to let you draw your lawn area and calculate square footage in real time.
            To activate it, add your Google Maps API key to{' '}
            <code className="bg-tt-light-lime px-1.5 py-0.5 rounded font-mono text-xs">LawnMeasurement.jsx</code>:
          </p>
          <div className="bg-tt-light-lime rounded-xl p-4 max-w-sm mx-auto text-left font-mono text-sm text-tt-forest mb-5">
            const GOOGLE_MAPS_API_KEY = "YOUR_KEY_HERE"
          </div>
          <div className="max-w-sm mx-auto tip-info text-left">
            <strong>Setup steps:</strong>
            <ol className="mt-1 space-y-0.5 list-decimal list-inside text-xs">
              <li>Visit console.cloud.google.com</li>
              <li>Create a project and enable Maps JavaScript API</li>
              <li>Also enable Geometry library and Geocoding API</li>
              <li>Create an API key and paste it into the file above</li>
            </ol>
          </div>
        </div>
        {measurements.length > 0 && <SavedMeasurements measurements={measurements} onDelete={id => setMeasurements(measurements.filter(m => m.id !== id))} />}
      </div>
    )
  }

  if (mapError === 'load-failed') {
    return (
      <div className="card text-center py-14">
        <Map className="w-14 h-14 text-tt-lime mx-auto mb-4 opacity-60" />
        <h2 className="text-xl font-bold text-tt-forest mb-2">Map Failed to Load</h2>
        <p className="text-tt-charcoal/70 text-sm max-w-md mx-auto">
          Could not load Google Maps. Check that your API key is valid and the Maps JavaScript API is enabled.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="section-title">
          <Ruler className="w-5 h-5 text-tt-orange" />
          Lawn Measurement Tool
        </h2>
        <p className="text-sm text-tt-charcoal/70 mb-3">
          Search your address to navigate to your property, then <strong>click points on the satellite map</strong> to outline your lawn area. Square footage updates live as you draw.
        </p>
        <div className="tip-warning">
          <strong>Estimate only.</strong> Measurements are approximate based on satellite imagery, which may not reflect current conditions. Verify critical measurements before purchasing materials.
        </div>
      </div>

      {mapsLoaded && (
        <div className="card py-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tt-charcoal/40 pointer-events-none" />
              <input className="input pl-10" value={addressInput} onChange={e => setAddressInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchAddress()} placeholder="Enter your Kansas City address…" />
            </div>
            <button className="btn-primary" onClick={searchAddress}>Go</button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden rounded-2xl">
        {!mapsLoaded && (
          <div className="h-96 flex items-center justify-center bg-tt-light-lime/40">
            <div className="flex items-center gap-2 text-tt-forest/50 text-sm">
              <Map className="w-5 h-5 animate-pulse" /> Loading satellite map…
            </div>
          </div>
        )}
        <div ref={mapDivRef} style={{ display: mapsLoaded ? 'block' : 'none' }} className="w-full h-96 sm:h-[520px]" />
      </div>

      {mapsLoaded && (
        <div className="card">
          <div className="flex flex-wrap gap-3 items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              {pointCount === 0 && <p className="text-sm text-tt-charcoal/60 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-tt-orange flex-shrink-0" />Click anywhere on the map to start placing corner points.</p>}
              {pointCount >= 1 && pointCount < 3 && <p className="text-sm text-tt-charcoal/60"><span className="font-semibold text-tt-forest">{pointCount}</span> point{pointCount !== 1 ? 's' : ''} placed — keep clicking to add more corners.</p>}
              {pointCount >= 3 && !isClosed && (
                <div>
                  <p className="text-sm text-tt-charcoal/60 mb-1"><span className="font-semibold text-tt-forest">{pointCount} points</span> — close the shape when you've outlined your lawn.</p>
                  {area > 0 && <p className="text-2xl font-extrabold text-tt-forest">{area.toLocaleString()}<span className="text-base font-normal text-tt-charcoal/50 ml-1">sq ft (preview)</span></p>}
                </div>
              )}
              {isClosed && <p className="text-sm text-tt-charcoal/60">Lawn area measured. Save it or reset to draw another area.</p>}
            </div>
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              {pointCount >= 3 && !isClosed && (
                <button className="btn-primary flex items-center gap-1.5 text-sm" onClick={closePolygon}>
                  <Check className="w-4 h-4" /> Close Shape
                </button>
              )}
              {pointCount > 0 && (
                <button className="btn-secondary flex items-center gap-1.5 text-sm" onClick={resetDrawing}>
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              )}
            </div>
          </div>

          {isClosed && area > 0 && (
            <div className="space-y-4">
              <div className="bg-tt-forest text-tt-cream rounded-2xl p-5 text-center">
                <p className="text-xs font-bold tracking-widest uppercase opacity-60 mb-2">Total Lawn Area</p>
                <p className="text-5xl font-extrabold leading-none">{area.toLocaleString()}</p>
                <p className="text-tt-lime font-semibold mt-1">square feet</p>
                <p className="text-tt-cream/40 text-xs mt-2">≈ {(area / 43560).toFixed(3)} acres</p>
              </div>
              <div>
                <h3 className="font-bold text-tt-forest text-sm mb-2 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-tt-orange" />Estimated Product Quantities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendations.map((r, i) => <ProductQtyRow key={i} {...r} />)}
                </div>
              </div>
              <div>
                <label className="label">Save this measurement</label>
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder='Label, e.g. "Front Yard"' value={saveLabel} onChange={e => setSaveLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveMeasurement()} />
                  <button className="btn-primary flex items-center gap-1.5 text-sm" onClick={saveMeasurement} disabled={!saveLabel.trim()}>
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {measurements.length > 0 && <SavedMeasurements measurements={measurements} onDelete={id => setMeasurements(measurements.filter(m => m.id !== id))} />}
    </div>
  )
}
