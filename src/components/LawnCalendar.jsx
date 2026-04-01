import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { calendarData, CATEGORY_COLORS, ZONE_GROUPS, getZoneGroup, MONTH_NAMES } from '../utils/calendarData.js'

const PRIORITY_BADGE = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-stone-100 text-stone-500',
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

  // All categories present this month
  const presentCategories = [...new Set(tasks.map(t => t.category))]

  return (
    <div className="card">
      <h2 className="section-title">
        <CalendarDays className="w-5 h-5 text-lawn-600" />
        Lawn Care Calendar
        {zone && (
          <span className="ml-auto text-xs font-normal text-stone-400">Zone {zone} · {zoneInfo.label}</span>
        )}
      </h2>

      {!zone && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <strong>Note:</strong> Showing Transition Zone schedule. Enter your ZIP code on the Dashboard to personalize.
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-stone-500" />
        </button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-stone-800">{MONTH_NAMES[viewMonth]}</h3>
          {viewMonth === today.getMonth() && (
            <span className="text-xs text-lawn-600 font-semibold">← Current Month</span>
          )}
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-stone-500" />
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
                ${isActive ? 'bg-lawn-700 text-white font-bold' : 'hover:bg-lawn-50 text-stone-500'}
                ${isNow && !isActive ? 'ring-2 ring-lawn-400' : ''}`}
            >
              <span className="text-xs">{name.slice(0, 1)}</span>
              {/* activity indicator */}
              <div className="flex justify-center gap-0.5 mt-0.5">
                {monthTasks.some(t => t.priority === 'high') && (
                  <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-lime-300' : 'bg-red-400'}`} />
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
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
              ${filterCategory === 'all' ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            All
          </button>
          {presentCategories.map(cat => {
            const colors = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border
                  ${filterCategory === cat
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}
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
          <p className="text-stone-400 text-sm text-center py-4">No tasks for this category in {MONTH_NAMES[viewMonth]}.</p>
        )}
        {filtered.map((task, i) => {
          const colors = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.cleanup
          return (
            <div key={i} className={`rounded-xl border-l-4 p-4 ${colors.bg} ${colors.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className={`font-semibold text-sm ${colors.text}`}>{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_BADGE[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{task.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-semibold whitespace-nowrap ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {colors.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick year overview summary */}
      <div className="mt-6 pt-4 border-t border-stone-100">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Year at a Glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, i) => {
            const monthTasks = calendarData[effectiveGroup][i] ?? []
            const highCount = monthTasks.filter(t => t.priority === 'high').length
            return (
              <button
                key={i}
                onClick={() => setViewMonth(i)}
                className={`text-left p-2 rounded-lg border transition-colors hover:border-lawn-300
                  ${i === viewMonth ? 'border-lawn-500 bg-lawn-50' : 'border-stone-100 bg-stone-50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${i === today.getMonth() ? 'text-lawn-700' : 'text-stone-600'}`}>
                    {name.slice(0, 3)}
                    {i === today.getMonth() && ' ●'}
                  </span>
                  {highCount > 0 && (
                    <span className="text-xs text-red-500 font-semibold">{highCount} high</span>
                  )}
                </div>
                <div className="flex gap-0.5 mt-1 flex-wrap">
                  {monthTasks.map((t, j) => {
                    const colors = CATEGORY_COLORS[t.category]
                    return <div key={j} className={`w-2 h-2 rounded-sm ${colors?.bg ?? 'bg-stone-200'} border ${colors?.border ?? ''}`} title={t.title} />
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
