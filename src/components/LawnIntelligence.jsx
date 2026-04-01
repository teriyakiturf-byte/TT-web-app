import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { generateTips } from '../utils/lawnIntelligence.js'

const TYPE_CONFIG = {
  warning: {
    className: 'tip-warning',
    Icon: AlertTriangle,
    iconClass: 'text-amber-600',
  },
  info: {
    className: 'tip-info',
    Icon: Info,
    iconClass: 'text-sky-600',
  },
  success: {
    className: 'tip-success',
    Icon: CheckCircle,
    iconClass: 'text-lawn-600',
  },
}

export default function LawnIntelligence({ weatherData, zone }) {
  const monthIndex = new Date().getMonth()
  const tips = generateTips(weatherData, zone, monthIndex)

  const hasWeather = !!weatherData?.current
  const hasZone = !!zone

  return (
    <div className="card">
      <h2 className="section-title">
        <Lightbulb className="w-5 h-5 text-earth-500" />
        Live Lawn Tips
      </h2>

      {!hasZone && !hasWeather && (
        <div className="text-center py-6 text-stone-400">
          <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Enter your ZIP code and weather API key to unlock personalized tips.</p>
        </div>
      )}

      {(hasZone || hasWeather) && tips.length === 0 && (
        <p className="text-stone-400 text-sm text-center py-4">
          No specific alerts right now. Enjoy your lawn! 🌿
        </p>
      )}

      <div className="space-y-3">
        {tips.map((tip, i) => {
          const { className, Icon, iconClass } = TYPE_CONFIG[tip.type] ?? TYPE_CONFIG.info
          return (
            <div key={i} className={className}>
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none mt-0.5 flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-semibold mb-0.5">{tip.title}</p>
                  <p className="opacity-80 text-xs leading-relaxed">{tip.body}</p>
                </div>
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ml-auto ${iconClass}`} />
              </div>
            </div>
          )
        })}
      </div>

      {(hasWeather || hasZone) && (
        <p className="text-xs text-stone-300 mt-4 text-right">
          Tips based on {hasWeather ? 'live weather' : ''}
          {hasWeather && hasZone ? ' + ' : ''}
          {hasZone ? `Zone ${zone}` : ''}
          {' · '}
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}
