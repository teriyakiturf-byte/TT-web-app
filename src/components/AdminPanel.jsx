import { useState } from 'react'
import { Shield, Plus, Trash2, Save, Lock, Eye, EyeOff, AlertTriangle, Info, CheckCircle, Megaphone } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const DEFAULT_PASSWORD = 'teriyakiturf2026'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const BLANK_TIP = () => ({ id: Date.now(), type: 'info', title: '', body: '' })

const TYPE_OPTS = [
  { value: 'info',    label: 'Info (blue)',    Icon: Info },
  { value: 'warning', label: 'Warning (orange)', Icon: AlertTriangle },
  { value: 'success', label: 'Success (green)', Icon: CheckCircle },
]

function Section({ title, children }) {
  return (
    <div className="card mb-5">
      <h3 className="section-title mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function AdminPanel({ onLock }) {
  const [storedPw, setStoredPw] = useLocalStorage('tt_admin_pw', DEFAULT_PASSWORD)
  const [announcement, setAnnouncement] = useLocalStorage('tt_announcement', null)
  const [customTips, setCustomTips] = useLocalStorage('tt_custom_tips', [])
  const [seasonalOverrides, setSeasonalOverrides] = useLocalStorage('tt_seasonal_overrides', {})

  // Password change
  const [newPw, setNewPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  // Announcement local edit state
  const [annDraft, setAnnDraft] = useState(announcement ?? { type: 'info', title: '', body: '' })

  // Seasonal override local edit state — populate from stored or blank
  const [seasonDraft, setSeasonDraft] = useState(() => {
    const base = {}
    for (let i = 0; i < 12; i++) base[i] = seasonalOverrides[i] ?? ''
    return base
  })

  function savePassword() {
    if (!newPw.trim() || newPw.trim().length < 6) return
    setStoredPw(newPw.trim())
    setNewPw('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  function saveAnnouncement() {
    if (!annDraft.title.trim() && !annDraft.body.trim()) {
      setAnnouncement(null)
    } else {
      setAnnouncement({ ...annDraft })
    }
  }

  function clearAnnouncement() {
    setAnnouncement(null)
    setAnnDraft({ type: 'info', title: '', body: '' })
  }

  function addTip() {
    setCustomTips(prev => [...prev, BLANK_TIP()])
  }

  function updateTip(id, field, value) {
    setCustomTips(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  function deleteTip(id) {
    setCustomTips(prev => prev.filter(t => t.id !== id))
  }

  function saveSeasonalOverrides() {
    const cleaned = {}
    for (let i = 0; i < 12; i++) {
      if (seasonDraft[i]?.trim()) cleaned[i] = seasonDraft[i].trim()
    }
    setSeasonalOverrides(cleaned)
    alert('Seasonal overrides saved. They will appear on the landing page immediately (same browser/device).')
  }

  function clearSeasonalOverride(i) {
    setSeasonDraft(prev => ({ ...prev, [i]: '' }))
    setSeasonalOverrides(prev => { const n = { ...prev }; delete n[i]; return n })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card bg-tt-forest text-tt-cream">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-tt-lime" />
            <div>
              <h2 className="font-bold text-lg leading-none">Admin Panel</h2>
              <p className="text-tt-lime/60 text-xs mt-0.5">Content management for Teriyaki Turf</p>
            </div>
          </div>
          <button onClick={onLock} className="flex items-center gap-1.5 text-tt-cream/60 hover:text-tt-cream text-sm font-semibold transition-colors">
            <Lock className="w-4 h-4" /> Lock
          </button>
        </div>
      </div>

      {/* Password */}
      <Section title="🔑 Change Password">
        <p className="text-sm text-tt-charcoal/60 mb-3">Minimum 6 characters. Default is <code className="bg-gray-100 px-1 rounded text-xs">teriyakiturf2026</code>.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPw ? 'text' : 'password'}
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="New password"
              className="input w-full pr-10"
            />
            <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tt-charcoal/40 hover:text-tt-charcoal">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={savePassword} className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
            {pwSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </Section>

      {/* Announcement Banner */}
      <Section title="📢 Dashboard Announcement">
        <p className="text-sm text-tt-charcoal/60 mb-4">
          Shows as a pinned card at the top of the Dashboard tab. Leave both fields blank to hide it.
        </p>
        <div className="space-y-3">
          <div>
            <label className="label">Type</label>
            <select
              value={annDraft.type}
              onChange={e => setAnnDraft(p => ({ ...p, type: e.target.value }))}
              className="input w-full"
            >
              {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={annDraft.title}
              onChange={e => setAnnDraft(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. 🚨 Pre-Emergent Window Now Open"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Body</label>
            <textarea
              value={annDraft.body}
              onChange={e => setAnnDraft(p => ({ ...p, body: e.target.value }))}
              placeholder="e.g. Soil temps hit 50°F in Johnson County today. Apply pre-emergent NOW."
              className="input w-full h-20 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={saveAnnouncement} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
              <Save className="w-4 h-4" /> Publish
            </button>
            <button onClick={clearAnnouncement} className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
              Clear
            </button>
          </div>
          {announcement && (
            <p className="text-xs text-tt-lime font-semibold">✓ Announcement is live on the Dashboard.</p>
          )}
        </div>
      </Section>

      {/* Custom Tips */}
      <Section title="💡 Custom Dashboard Tips">
        <p className="text-sm text-tt-charcoal/60 mb-4">
          Pinned to the top of Live Lawn Tips on the Dashboard. Saved automatically as you type.
        </p>
        {customTips.length === 0 && (
          <p className="text-sm text-tt-charcoal/40 italic mb-3">No custom tips yet.</p>
        )}
        {customTips.map((tip) => (
          <div key={tip.id} className="border border-tt-lime/20 rounded-xl p-4 mb-3 space-y-2">
            <div className="flex gap-2">
              <select
                value={tip.type}
                onChange={e => updateTip(tip.id, 'type', e.target.value)}
                className="input text-sm py-1.5 w-32"
              >
                {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label.split(' ')[0]}</option>)}
              </select>
              <input
                type="text"
                value={tip.title}
                onChange={e => updateTip(tip.id, 'title', e.target.value)}
                placeholder="Tip title"
                className="input flex-1 text-sm py-1.5"
              />
              <button onClick={() => deleteTip(tip.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={tip.body}
              onChange={e => updateTip(tip.id, 'body', e.target.value)}
              placeholder="Tip body text"
              className="input w-full h-16 text-sm resize-none"
            />
          </div>
        ))}
        <button onClick={addTip} className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Custom Tip
        </button>
      </Section>

      {/* Seasonal Bar Overrides */}
      <Section title="🌿 Seasonal Bar Overrides (Landing Page)">
        <p className="text-sm text-tt-charcoal/60 mb-4">
          Override any month's message on the orange bar on the landing page. Leave blank to use the default.
          Changes are visible on the <strong>same device/browser</strong> only — for permanent changes, update the source.
        </p>
        <div className="space-y-3">
          {MONTH_NAMES.map((name, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="label mt-2.5 w-24 flex-shrink-0">{name}</span>
              <input
                type="text"
                value={seasonDraft[i] ?? ''}
                onChange={e => setSeasonDraft(prev => ({ ...prev, [i]: e.target.value }))}
                placeholder="Leave blank for default"
                className="input flex-1 text-sm"
              />
              {(seasonalOverrides[i]) && (
                <button onClick={() => clearSeasonalOverride(i)} title="Reset to default" className="mt-2 text-tt-charcoal/40 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={saveSeasonalOverrides} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold mt-4">
          <Save className="w-4 h-4" /> Save Seasonal Overrides
        </button>
      </Section>
    </div>
  )
}
