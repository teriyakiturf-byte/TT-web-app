import { Leaf, Calculator, CalendarDays, CheckSquare } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard',   icon: Leaf },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'calendar',  label: 'Calendar',   icon: CalendarDays },
  { id: 'tasks',     label: 'Tasks & Notes', icon: CheckSquare },
]

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="bg-gradient-to-r from-lawn-900 to-lawn-700 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/15 rounded-xl p-2">
            <Leaf className="w-7 h-7 text-lime-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-none">TurfTutor</h1>
            <p className="text-lawn-200 text-xs font-medium tracking-wide">Lawn Care Intelligence</p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 -mb-px">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors duration-150 focus:outline-none
                ${activeTab === id
                  ? 'bg-stone-50 text-lawn-800 shadow-sm'
                  : 'text-lawn-200 hover:text-white hover:bg-white/10'
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
