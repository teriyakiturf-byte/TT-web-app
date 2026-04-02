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
import { useLocalStorage } from './hooks/useLocalStorage.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Persistent state
  const [zipCode, setZipCode] = useLocalStorage('tt_zipCode', '')
  const [zone, setZone] = useLocalStorage('tt_zone', '')
  const [apiKey, setApiKey] = useLocalStorage('tt_owm_key', '')
  const [sqFootage, setSqFootage] = useLocalStorage('tt_sqft', '')
  const [todos, setTodos] = useLocalStorage('tt_todos', [])
  const [notes, setNotes] = useLocalStorage('tt_notes', [])

  // Session-only weather state (refreshed on demand)
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Auto-fetch weather when zip + key are available on first load
  useEffect(() => {
    if (apiKey && zipCode && !weatherData) {
      fetchWeatherData(apiKey, zipCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchWeatherData(key, zip) {
    if (!key || !zip) return
    setWeatherLoading(true)
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${key}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&appid=${key}`),
      ])
      if (!currentRes.ok) throw new Error('Weather fetch failed')
      const [current, forecast] = await Promise.all([currentRes.json(), forecastRes.json()])
      setWeatherData({ current, forecast })
    } catch {
      // silently fail; WeatherWidget shows its own error state
    } finally {
      setWeatherLoading(false)
    }
  }

  // When ZIP is updated via ZoneLookup, also refresh weather
  function handleZipChange(newZip) {
    setZipCode(newZip)
    if (apiKey) fetchWeatherData(apiKey, newZip)
  }

  // When API key is saved in WeatherWidget, persist it here
  function handleApiKeyChange(key) {
    setApiKey(key)
  }

  return (
    <div className="min-h-screen bg-tt-cream">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ZoneLookup
                zipCode={zipCode}
                onZipChange={handleZipChange}
                zone={zone}
                onZoneChange={setZone}
              />
              <WeatherWidget
                apiKey={apiKey}
                onApiKeyChange={handleApiKeyChange}
                zipCode={zipCode}
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
          <ProductCalculator
            sqFootage={sqFootage}
            onSqFootageChange={setSqFootage}
          />
        )}

        {/* ── Calendar ── */}
        {activeTab === 'calendar' && (
          <LawnCalendar zone={zone} />
        )}

        {/* ── Tasks & Notes ── */}
        {activeTab === 'tasks' && (
          <div className="space-y-5">
            <TodoList
              todos={todos}
              onTodosChange={setTodos}
              zone={zone}
            />
            <Notes
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>
        )}

        {/* ── FAQ ── */}
        {activeTab === 'faq' && <FAQ />}

        {/* ── Products ── */}
        {activeTab === 'products' && <Products />}

        {/* ── Lawn Measurement ── */}
        {activeTab === 'measure' && <LawnMeasurement />}
      </main>

      <footer className="text-center text-xs text-tt-charcoal/40 py-6 border-t border-tt-lime/20 mt-10">
        Teriyaki Turf · Zone data from phzmapi.org · Weather from OpenWeatherMap
      </footer>
    </div>
  )
}
