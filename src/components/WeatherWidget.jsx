import { Cloud, Loader2, RefreshCw, Thermometer, Droplets, Wind, Sun } from 'lucide-react'

// WMO weather code → emoji + description
function wmoInfo(code) {
  if (code === 0)               return { icon: '☀️', desc: 'Clear sky' }
  if (code === 1)               return { icon: '🌤️', desc: 'Mainly clear' }
  if (code === 2)               return { icon: '⛅', desc: 'Partly cloudy' }
  if (code === 3)               return { icon: '☁️', desc: 'Overcast' }
  if (code <= 48)               return { icon: '🌫️', desc: 'Foggy' }
  if (code <= 57)               return { icon: '🌦️', desc: 'Drizzle' }
  if (code <= 67)               return { icon: '🌧️', desc: 'Rain' }
  if (code <= 77)               return { icon: '❄️', desc: 'Snow' }
  if (code <= 82)               return { icon: '🌦️', desc: 'Rain showers' }
  if (code <= 86)               return { icon: '🌨️', desc: 'Snow showers' }
  if (code >= 95)               return { icon: '⛈️', desc: 'Thunderstorm' }
  return { icon: '🌡️', desc: 'Unknown' }
}

const DAY_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

export default function WeatherWidget({ location, weatherData, onWeatherData, loading, onLoading }) {
  async function fetchWeather() {
    if (!location?.lat || !location?.lon) return
    onLoading(true)
    try {
      const { lat, lon } = location
      const url = [
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`,
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index`,
        `&hourly=precipitation,weather_code,wind_speed_10m,relative_humidity_2m`,
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum`,
        `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`,
        `&timezone=auto&forecast_days=7`,
      ].join('')
      const res = await fetch(url)
      if (!res.ok) throw new Error('Weather fetch failed')
      const data = await res.json()
      onWeatherData(data)
    } catch {
      // WeatherWidget shows its own empty state
    } finally {
      onLoading(false)
    }
  }

  const c = weatherData?.current
  const daily = weatherData?.daily
  const { icon, desc } = c ? wmoInfo(c.weather_code) : {}

  const forecastDays = daily
    ? daily.time.slice(1, 8).map((date, i) => ({
        label: DAY_FMT.format(new Date(date + 'T12:00:00')),
        high: Math.round(daily.temperature_2m_max[i + 1]),
        low: Math.round(daily.temperature_2m_min[i + 1]),
        precip: daily.precipitation_sum[i + 1],
        code: daily.weather_code[i + 1],
      }))
    : []

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <Cloud className="w-5 h-5 text-tt-lime" />
          Live Weather
        </h2>
        {location?.lat && (
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="text-tt-charcoal/30 hover:text-tt-lime transition-colors p-1"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!location?.lat && (
        <div className="text-center py-6 text-tt-charcoal/40">
          <Cloud className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Enter your ZIP code to load live weather — no API key needed.</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-tt-charcoal/40">
          <Loader2 className="w-5 h-5 animate-spin text-tt-lime" />
          <span>Loading weather…</span>
        </div>
      )}

      {c && !loading && (
        <>
          {/* Current conditions */}
          <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-tt-light-lime to-tt-light-lime/60 rounded-xl border border-tt-lime/30">
            <div className="text-5xl">{icon}</div>
            <div className="flex-1">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-tt-charcoal">{Math.round(c.temperature_2m)}°</span>
                <span className="text-tt-charcoal/40 text-sm mb-1.5">F</span>
              </div>
              <p className="text-tt-charcoal font-semibold capitalize">{desc}</p>
              <p className="text-tt-charcoal/50 text-xs mt-0.5">{location?.cityName ?? ''}</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <div className="flex items-center gap-1 text-tt-charcoal/60 justify-end">
                <Thermometer className="w-3.5 h-3.5" /> Feels {Math.round(c.apparent_temperature)}°F
              </div>
              <div className="flex items-center gap-1 text-tt-forest justify-end font-semibold">
                <Droplets className="w-3.5 h-3.5" /> {c.relative_humidity_2m}%
              </div>
              <div className="flex items-center gap-1 text-tt-charcoal/60 justify-end">
                <Wind className="w-3.5 h-3.5" /> {Math.round(c.wind_speed_10m)} mph
              </div>
              <div className="flex items-center gap-1 text-tt-orange justify-end font-semibold">
                <Sun className="w-3.5 h-3.5" /> UV {c.uv_index ?? '—'}
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          {forecastDays.length > 0 && (
            <div>
              <p className="text-xs font-bold text-tt-charcoal/40 uppercase tracking-wider mb-2">7-Day Forecast</p>
              <div className="grid grid-cols-7 gap-1">
                {forecastDays.map(day => (
                  <div key={day.label} className="flex flex-col items-center gap-0.5 bg-tt-cream rounded-lg py-2 px-1 border border-tt-lime/20">
                    <span className="text-xs font-bold text-tt-charcoal/50">{day.label}</span>
                    <span className="text-xl leading-tight">{wmoInfo(day.code).icon}</span>
                    <span className="text-xs font-extrabold text-tt-charcoal">{day.high}°</span>
                    <span className="text-xs text-tt-charcoal/40">{day.low}°</span>
                    {day.precip > 0 && (
                      <span className="text-xs text-tt-forest font-bold">{day.precip.toFixed(2)}"</span>
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
