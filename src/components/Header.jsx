import { Leaf, Calculator, CalendarDays, CheckSquare, HelpCircle, ShoppingBag, Ruler, Shield } from 'lucide-react'

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: Leaf },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'calendar',   label: 'Calendar',   icon: CalendarDays },
  { id: 'tasks',      label: 'Tasks',      icon: CheckSquare },
  { id: 'faq',        label: 'FAQ',        icon: HelpCircle },
  { id: 'products',   label: 'Products',   icon: ShoppingBag },
  { id: 'measure',    label: 'Measure',    icon: Ruler },
]

export default function Header({ activeTab, onTabChange, showAdmin = false, onLogoClick }) {
  const visibleTabs = showAdmin
    ? [...TABS, { id: 'admin', label: 'Admin', icon: Shield }]
    : TABS

  return (
    <header className="bg-tt-forest text-tt-cream shadow-lg">
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-0">

        {/* Brand bar */}
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={onLogoClick}
            className="bg-tt-cream rounded-xl px-4 py-2 flex-shrink-0 focus:outline-none"
            aria-label="Teriyaki Turf home"
            title="Teriyaki Turf"
          >
            <img
              src="/TT-web-app/tt-logo.svg"
              alt="Teriyaki Turf"
              className="h-10 w-auto"
            />
          </button>

          <p className="hidden sm:block text-tt-lime/80 text-xs font-semibold tracking-widest uppercase">
            Lawn Care Intelligence
          </p>

          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 bg-tt-orange/20 border border-tt-orange/40 text-tt-orange text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-tt-orange animate-pulse" />
            Live Tips
          </span>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors duration-150 focus:outline-none whitespace-nowrap flex-shrink-0
                ${activeTab === id
                  ? 'bg-tt-cream text-tt-forest shadow-sm'
                  : id === 'admin'
                    ? 'text-tt-orange/80 hover:text-tt-orange hover:bg-white/10'
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
