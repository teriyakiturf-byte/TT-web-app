import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { calendarData, CATEGORY_COLORS, ZONE_GROUPS, getZoneGroup, MONTH_NAMES } from '../utils/calendarData.js'

const PRIORITY_BADGE = {
  high:   'bg-tt-light-orange text-tt-orange border border-tt-orange/30',
  medium: 'bg-tt-cream text-tt-charcoal/70 border border-tt-lime/30',
  low:    'bg-white text-tt-charcoal/40 border border-tt-lime/20',
}

export default function LawnCalendar({ zone }) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [filterCategory, setFilterCategory] = useState('all')

  const zoneGroup = getZoneGroup(zone)
  const effectiveGroup = zoneGroup || 'transition'
  const zoneInfo = ZONE_GROUPS[effectiveGroup]

  const tasks = calendarData[effectiveGroup][viewMonth] ?? []
  const filtered = filterCategory === 'all' ? tasks : tasks.filter(t => t.category === filterCategory)

  function prevMonth() { setViewMonth(m => (m === 0 ? 11 : m - 1)) }
  function nextMonth() { setViewMonth(m => (m === 11 ? 0 : m + 1)) }

  const presentCategories = [...new Set(tasks.map(t => t.category))]

  return (
    <div className="card">
      <h2 className="section-title">
        <CalendarDays className="w-5 h-5 text-tt-lime" />
        Lawn Care Calendar
        {zone && (
          <span className="ml-auto text-xs font-normal text-tt-charcoal/40">Zone {zone} · {zoneInfo.label}</span>
        )}
      </h2>

      {!zone && (
        <div className="mb-4 p-3 bg-tt-light-orange border border-tt-orange/30 rounded-xl text-tt-charcoal text-sm">
          <strong className="text-tt-orange">Note:</strong> Showing Transition Zone schedule. Enter your ZIP code on the Dashboard to personalize.
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 hover:bg-tt-cream rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-tt-charcoal/50" />
        </button>
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-tt-charcoal">{MONTH_NAMES[viewMonth]}</h3>
          {viewMonth === today.getMonth() && (
            <span className="text-xs text-tt-orange font-bold tracking-wide">● Current Month</span>
          )}
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-tt-cream rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-tt-charcoal/50" />
        </button>
      </div>

      {/* 12-month mini-grid */}
      <div className="grid grid-cols-12 gap-0.5 mb-5">
        {MONTH_NAMES.map((name, i) => {
          const monthTasks = calendarData[effectiveGroup][i] ?? []
          const isActive = i === viewMonth
          const isNow = i === today.getMonth()
          return (
            <button
              key={i}
              onClick={() => setViewMonth(i)}
              className={`relative rounded py-1 text-center transition-colors
                ${isActive ? 'bg-tt-forest text-tt-cream font-bold' : 'hover:bg-tt-light-lime text-tt-charcoal/50'}
                ${isNow && !isActive ? 'ring-2 ring-tt-orange' : ''}`}
            >
              <span className="text-xs">{name.slice(0, 1)}</span>
              <div className="flex justify-center gap-0.5 mt-0.5">
                {monthTasks.some(t => t.priority === 'high') && (
                  <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-tt-lime' : 'bg-tt-orange'}`} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Category filter */}
      {presentCategories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors
              ${filterCategory === 'all' ? 'bg-tt-forest text-tt-cream' : 'bg-tt-cream text-tt-charcoal/60 hover:bg-tt-light-lime'}`}
          >
            All
          </button>
          {presentCategories.map(cat => {
            const colors = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border
                  ${filterCategory === cat
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'bg-white text-tt-charcoal/50 border-tt-lime/20 hover:bg-tt-light-lime'}`}
              >
                {CATEGORY_COLORS[cat]?.label ?? cat}
              </button>
            )
          })}
        </div>
      )}

      {/* Task cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-tt-charcoal/40 text-sm text-center py-4">
            No tasks for this category in {MONTH_NAMES[viewMonth]}.
          </p>
        )}
        {filtered.map((task, i) => {
          const colors = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.cleanup
          return (
            <div key={i} className={`rounded-xl border-l-4 p-4 ${colors.bg} ${colors.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className={`font-bold text-sm ${colors.text}`}>{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${PRIORITY_BADGE[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-tt-charcoal/60 leading-relaxed">{task.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-bold whitespace-nowrap ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {colors.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Year overview */}
      <div className="mt-6 pt-4 border-t border-tt-lime/20">
        <p className="text-xs font-bold text-tt-charcoal/40 uppercase tracking-wider mb-3">Year at a Glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, i) => {
            const monthTasks = calendarData[effectiveGroup][i] ?? []
            const highCount = monthTasks.filter(t => t.priority === 'high').length
            return (
              <button
                key={i}
                onClick={() => setViewMonth(i)}
                className={`text-left p-2 rounded-lg border transition-colors hover:border-tt-lime
                  ${i === viewMonth ? 'border-tt-forest bg-tt-light-lime' : 'border-tt-lime/20 bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${i === today.getMonth() ? 'text-tt-orange' : 'text-tt-charcoal/60'}`}>
                    {name.slice(0, 3)}
                    {i === today.getMonth() && ' ●'}
                  </span>
                  {highCount > 0 && (
                    <span className="text-xs text-tt-orange font-bold">{highCount} high</span>
                  )}
                </div>
                <div className="flex gap-0.5 mt-1 flex-wrap">
                  {monthTasks.map((t, j) => {
                    const colors = CATEGORY_COLORS[t.category]
                    return <div key={j} className={`w-2 h-2 rounded-sm ${colors?.bg ?? 'bg-tt-cream'} border ${colors?.border ?? ''}`} title={t.title} />
                  })}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
