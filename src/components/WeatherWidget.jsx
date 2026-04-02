import { useState } from 'react'
import { Cloud, Loader2, RefreshCw, Eye, EyeOff, Thermometer, Droplets, Wind, Sun } from 'lucide-react'

const OWM_ICONS = {
  '01d': '☀️', '01n': '🌑',
  '02d': '⛅', '02n': '🌤',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌦️', '09n': '🌦️',
  '10d': '🌧️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

function getIcon(code) {
  return OWM_ICONS[code] || '🌡️'
}

function kelvinToF(k) {
  return Math.round((k - 273.15) * 9/5 + 32)
}

function groupForecastByDay(list) {
  const days = {}
  for (const item of list) {
    const date = new Date(item.dt * 1000)
    const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    if (!days[key]) {
      days[key] = { key, temps: [], icons: [], rain: 0, dt: item.dt }
    }
    days[key].temps.push(item.main.temp)
    days[key].icons.push(item.weather[0].icon)
    days[key].rain += item.rain?.['3h'] ?? 0
  }
  return Object.values(days).slice(0, 7).map(d => ({
    ...d,
    high: Math.round(Math.max(...d.temps.map(kelvinToF))),
    low:  Math.round(Math.min(...d.temps.map(kelvinToF))),
    icon: d.icons[Math.floor(d.icons.length / 2)],
  }))
}

export default function WeatherWidget({ apiKey, onApiKeyChange, zipCode, weatherData, onWeatherData, loading, onLoading }) {
  const [showKeyInput, setShowKeyInput] = useState(!apiKey)
  const [keyInput, setKeyInput] = useState(apiKey || '')
  const [error, setError] = useState('')

  async function fetchWeather(key, zip) {
    if (!key || !zip) return
    setError('')
    onLoading(true)
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${key}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&appid=${key}`),
      ])
      if (!currentRes.ok) {
        const err = await currentRes.json()
        throw new Error(err.message || 'Invalid API key or ZIP code')
      }
      const [current, forecast] = await Promise.all([currentRes.json(), forecastRes.json()])
      onWeatherData({ current, forecast })
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.')
    } finally {
      onLoading(false)
    }
  }

  function handleSaveKey(e) {
    e.preventDefault()
    const k = keyInput.trim()
    if (!k) return
    onApiKeyChange(k)
    setShowKeyInput(false)
    fetchWeather(k, zipCode)
  }

  const current = weatherData?.current
  const forecast = weatherData?.forecast ? groupForecastByDay(weatherData.forecast.list) : []
  const tempF = current ? kelvinToF(current.main.temp) : null
  const feelsF = current ? kelvinToF(current.main.feels_like) : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <Cloud className="w-5 h-5 text-tt-lime" />
          Live Weather
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowKeyInput(v => !v)}
            className="text-tt-charcoal/30 hover:text-tt-charcoal/60 transition-colors p-1"
            title={showKeyInput ? 'Hide API key' : 'Set API key'}
          >
            {showKeyInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {apiKey && zipCode && (
            <button
              onClick={() => fetchWeather(apiKey, zipCode)}
              disabled={loading}
              className="text-tt-charcoal/30 hover:text-tt-lime transition-colors p-1"
              title="Refresh weather"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <form onSubmit={handleSaveKey} className="mb-4 p-3 bg-tt-light-lime rounded-xl border border-tt-lime/40">
          <label className="label text-tt-forest">OpenWeatherMap API Key</label>
          <p className="text-xs text-tt-forest/70 mb-2">
            Free key at <span className="font-mono">openweathermap.org</span>. Stored locally only.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="Paste your API key…"
              className="input flex-1 font-mono text-sm"
            />
            <button type="submit" className="btn-primary text-sm">Save</button>
          </div>
        </form>
      )}

      {error && (
        <p className="text-tt-orange text-sm mb-3 p-2 bg-tt-light-orange rounded-lg font-semibold">{error}</p>
      )}

      {!apiKey && !showKeyInput && (
        <p className="text-tt-charcoal/40 text-sm text-center py-4">
          Add your OpenWeatherMap API key to enable live weather.
        </p>
      )}

      {!zipCode && apiKey && (
        <p className="text-tt-charcoal/40 text-sm text-center py-4">
          Enter a ZIP code on the left to load weather data.
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-tt-charcoal/40">
          <Loader2 className="w-5 h-5 animate-spin text-tt-lime" />
          <span>Loading weather…</span>
        </div>
      )}

      {current && !loading && (
        <>
          {/* Current conditions */}
          <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-tt-light-lime to-tt-light-lime/60 rounded-xl border border-tt-lime/30">
            <div className="text-5xl">{getIcon(current.weather[0]?.icon)}</div>
            <div className="flex-1">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-tt-charcoal">{tempF}°</span>
                <span className="text-tt-charcoal/40 text-sm mb-1.5">F</span>
              </div>
              <p className="text-tt-charcoal font-semibold capitalize">{current.weather[0]?.description}</p>
              <p className="text-tt-charcoal/50 text-xs mt-0.5">{current.name}</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <div className="flex items-center gap-1 text-tt-charcoal/60 justify-end">
                <Thermometer className="w-3.5 h-3.5" /> Feels {feelsF}°F
              </div>
              <div className="flex items-center gap-1 text-tt-forest justify-end font-semibold">
                <Droplets className="w-3.5 h-3.5" /> {current.main.humidity}%
              </div>
              <div className="flex items-center gap-1 text-tt-charcoal/60 justify-end">
                <Wind className="w-3.5 h-3.5" /> {Math.round(current.wind.speed)} mph
              </div>
              <div className="flex items-center gap-1 text-tt-orange justify-end font-semibold">
                <Sun className="w-3.5 h-3.5" /> UV {current.uvi ?? '—'}
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          {forecast.length > 0 && (
            <div>
              <p className="text-xs font-bold text-tt-charcoal/40 uppercase tracking-wider mb-2">7-Day Forecast</p>
              <div className="grid grid-cols-7 gap-1">
                {forecast.map(day => (
                  <div key={day.key} className="flex flex-col items-center gap-0.5 bg-tt-cream rounded-lg py-2 px-1 border border-tt-lime/20">
                    <span className="text-xs font-bold text-tt-charcoal/50">{day.key.split(',')[0]}</span>
                    <span className="text-xl leading-tight">{getIcon(day.icon)}</span>
                    <span className="text-xs font-extrabold text-tt-charcoal">{day.high}°</span>
                    <span className="text-xs text-tt-charcoal/40">{day.low}°</span>
                    {day.rain > 0 && (
                      <span className="text-xs text-tt-forest font-bold">{day.rain.toFixed(1)}"</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
