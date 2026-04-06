import { useNavigate } from 'react-router-dom'
import { Leaf, Calculator, CalendarDays, CheckSquare, HelpCircle, ShoppingBag, Ruler, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: Leaf },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'calendar',   label: 'Calendar',   icon: CalendarDays },
  { id: 'tasks',      label: 'Tasks',      icon: CheckSquare },
  { id: 'faq',        label: 'FAQ',        icon: HelpCircle },
  { id: 'products',   label: 'Products',   icon: ShoppingBag },
  { id: 'measure',    label: 'Measure',    icon: Ruler },
]

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Header({ activeTab, onTabChange }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-tt-forest text-tt-cream shadow-lg">
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-0">

        {/* Brand bar */}
        <div className="flex items-center gap-4 mb-5">
          {/* Full horizontal wordmark on a cream pill — preserves colours on dark bg */}
          <div className="bg-tt-cream rounded-xl px-4 py-2 flex-shrink-0">
            <img
              src="/TT-web-app/tt-logo.svg"
              alt="Teriyaki Turf"
              className="h-10 w-auto"
            />
          </div>

          {/* Tagline — desktop only */}
          <p className="hidden sm:block text-tt-lime/80 text-xs font-semibold tracking-widest uppercase">
            Lawn Care Intelligence
          </p>

          {/* Live tips badge */}
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 bg-tt-orange/20 border border-tt-orange/40 text-tt-orange text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-tt-orange animate-pulse" />
            Live Tips
          </span>

          {/* User menu */}
          {user && (
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 hover:bg-white/10 rounded-xl px-3 py-1.5 transition-colors"
                title="My Profile"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-tt-lime/50" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-tt-orange flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="hidden md:inline text-sm font-semibold text-tt-lime">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-tt-lime/60 hover:text-tt-cream p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
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
