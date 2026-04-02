import { Leaf, Calculator, CalendarDays, CheckSquare } from 'lucide-react'

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',    icon: Leaf },
  { id: 'calculator', label: 'Calculator',   icon: Calculator },
  { id: 'calendar',   label: 'Calendar',     icon: CalendarDays },
  { id: 'tasks',      label: 'Tasks & Notes', icon: CheckSquare },
]

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="bg-tt-forest text-tt-cream shadow-lg">
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-0">

        {/* Brand bar */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/TT-web-app/tt-logo.svg"
            alt="Teriyaki Turf logo"
            className="w-11 h-11 flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-none text-tt-cream">
              Teriyaki Turf
            </h1>
            <p className="text-tt-lime text-xs font-semibold tracking-widest uppercase mt-0.5">
              Lawn Care Intelligence
            </p>
          </div>

          {/* Orange accent pill — desktop only */}
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 bg-tt-orange/20 border border-tt-orange/40 text-tt-orange text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-tt-orange animate-pulse" />
            Live Tips
          </span>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 -mb-px">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors duration-150 focus:outline-none
                ${activeTab === id
                  ? 'bg-tt-cream text-tt-forest shadow-sm'
                  : 'text-tt-lime/80 hover:text-tt-cream hover:bg-white/10'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
