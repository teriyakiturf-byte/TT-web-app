import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ZoneLookup from './components/ZoneLookup.jsx'
import WeatherWidget from './components/WeatherWidget.jsx'
import LawnIntelligence from './components/LawnIntelligence.jsx'
import ProductCalculator from './components/ProductCalculator.jsx'
import LawnCalendar from './components/LawnCalendar.jsx'
import TodoList from './components/TodoList.jsx'
import Notes from './components/Notes.jsx'
import FAQ from './components/FAQ.jsx'
import Products from './components/Products.jsx'
import LawnMeasurement from './components/LawnMeasurement.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react'

const ANN_ICONS = { warning: AlertTriangle, info: Info, success: CheckCircle }
const ANN_CLASSES = {
  warning: 'tip-warning',
  info: 'tip-info',
  success: 'tip-success',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Persistent state
  const [zipCode, setZipCode] = useLocalStorage('tt_zipCode', '')
  const [zone, setZone] = useLocalStorage('tt_zone', '')
  const [location, setLocation] = useLocalStorage('tt_location', null) // { lat, lon, cityName }
  const [sqFootage, setSqFootage] = useLocalStorage('tt_sqft', '')
  const [todos, setTodos] = useLocalStorage('tt_todos', [])
  const [notes, setNotes] = useLocalStorage('tt_notes', [])

  // Admin state (read-only here; AdminPanel manages writes)
  const [storedPw] = useLocalStorage('tt_admin_pw', 'teriyakiturf2026')
  const [announcement] = useLocalStorage('tt_announcement', null)
  const [annDismissed, setAnnDismissed] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [adminAuthed, setAdminAuthed] = useState(false)
  // Logo click counter to reveal admin tab
  const [logoClicks, setLogoClicks] = useState(0)

  // Session-only weather state
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Reveal admin tab after 5 rapid logo clicks
  function handleLogoClick() {
    setLogoClicks(n => {
      const next = n + 1
      if (next >= 5) {
        setAdminUnlocked(true)
        return 0
      }
      // Reset counter after 3 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 3000)
      return next
    })
  }

  // Also reveal via URL param ?admin
  useEffect(() => {
    if (window.location.search.includes('admin')) {
      setAdminUnlocked(true)
    }
  }, [])

  useEffect(() => {
    if (location?.lat && !weatherData) {
      fetchWeatherData(location)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchWeatherData(loc) {
    if (!loc?.lat || !loc?.lon) return
    setWeatherLoading(true)
    try {
      const url = [
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}`,
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index`,
        `&hourly=precipitation,weather_code,wind_speed_10m,relative_humidity_2m`,
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum`,
        `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`,
        `&timezone=auto&forecast_days=7`,
      ].join('')
      const res = await fetch(url)
      if (!res.ok) throw new Error('Weather fetch failed')
      const data = await res.json()
      setWeatherData(data)
    } catch {
      // silently fail; WeatherWidget shows its own empty state
    } finally {
      setWeatherLoading(false)
    }
  }

  function handleLocationChange(loc) {
    setLocation(loc)
    setWeatherData(null)
    fetchWeatherData(loc)
  }

  // Announcement banner (only on dashboard, dismissable per session)
  const showBanner = activeTab === 'dashboard' && announcement && !annDismissed
  const AnnIcon = announcement ? ANN_ICONS[announcement.type] ?? Info : null

  return (
    <div className="min-h-screen bg-tt-cream">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAdmin={adminUnlocked}
        onLogoClick={handleLogoClick}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Announcement Banner */}
        {showBanner && (
          <div className={`${ANN_CLASSES[announcement.type]} flex gap-3 items-start mb-5 pr-3`}>
            <AnnIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {announcement.title && <p className="font-bold leading-snug">{announcement.title}</p>}
              {announcement.body && <p className="text-sm mt-0.5 opacity-85">{announcement.body}</p>}
            </div>
            <button onClick={() => setAnnDismissed(true)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ZoneLookup
                zipCode={zipCode}
                onZipChange={setZipCode}
                zone={zone}
                onZoneChange={setZone}
                onLocationChange={handleLocationChange}
              />
              <WeatherWidget
                location={location}
                weatherData={weatherData}
                onWeatherData={setWeatherData}
                loading={weatherLoading}
                onLoading={setWeatherLoading}
              />
            </div>
            <LawnIntelligence weatherData={weatherData} zone={zone} />
          </div>
        )}

        {/* ── Calculator ── */}
        {activeTab === 'calculator' && (
          <ProductCalculator sqFootage={sqFootage} onSqFootageChange={setSqFootage} />
        )}

        {/* ── Calendar ── */}
        {activeTab === 'calendar' && <LawnCalendar zone={zone} />}

        {/* ── Tasks & Notes ── */}
        {activeTab === 'tasks' && (
          <div className="space-y-5">
            <TodoList todos={todos} onTodosChange={setTodos} zone={zone} />
            <Notes notes={notes} onNotesChange={setNotes} />
          </div>
        )}

        {/* ── FAQ ── */}
        {activeTab === 'faq' && <FAQ />}

        {/* ── Products ── */}
        {activeTab === 'products' && <Products />}

        {/* ── Lawn Measurement ── */}
        {activeTab === 'measure' && <LawnMeasurement />}

        {/* ── Admin ── */}
        {activeTab === 'admin' && (
          adminAuthed
            ? <AdminPanel onLock={() => { setAdminAuthed(false); setActiveTab('dashboard') }} />
            : <AdminLogin storedPw={storedPw} onSuccess={() => setAdminAuthed(true)} />
        )}
      </main>

      <footer className="text-center text-xs text-tt-charcoal/40 py-6 border-t border-tt-lime/20 mt-10">
        Teriyaki Turf · Zone data from phzmapi.org · Weather from OpenWeatherMap
      </footer>
    </div>
  )
}
