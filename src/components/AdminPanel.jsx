import { useState } from 'react'
import { Shield, Plus, Trash2, Save, Lock, Eye, EyeOff, AlertTriangle,
         Info, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const DEFAULT_PASSWORD = 'teriyakiturf2026'

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']

const BLANK_TIP = () => ({ id: Date.now(), type: 'info', title: '', body: '' })

const TYPE_OPTS = [
  { value: 'info',    label: 'Info (blue)' },
  { value: 'warning', label: 'Warning (orange)' },
  { value: 'success', label: 'Success (green)' },
]

// ── Default content for the landing page (mirrors the HTML) ──────────────────
const PAGE_DEFAULTS = {
  hero: {
    eyebrow: 'Kansas City · Zone 6a · Since 2016',
    headlineBefore: 'Kansas City Lawns Are ',
    headlineHighlight: 'Different.',
    headlineAfter: ' So Is This.',
    sub: '8 years of real KC homeowner experience. Clay soil, fungal nightmares, Zone 6a winters — and a backyard that was 60% weeds when we started. Finally figured out. Built into free tools anyone can use.',
  },
  lead: {
    sub: 'Month-by-month timing built for Zone 6a. Not Phoenix. Not Atlanta. Kansas City.',
    item: [
      ' Month-by-month task schedule built for Zone 6a KC',
      ' Pre-emergent timing windows — crabgrass AND clover',
      ' Fertilizer rotation that actually works on KC clay soil',
      " Johnson County blackout dates so you don't get fined",
      ' Exact overseeding and aeration windows for fescue',
      " What to do when your lawn looks dead in July (spoiler: it's probably not)",
    ],
  },
  about: {
    p1: 'I moved to Overland Park in 2016 with zero lawn experience and a backyard that was 60% weeds, 30% bare dirt, and 10% optimism. After two years of bad advice, wasted products, and one fungus outbreak I still think about at 3am — I started keeping detailed notes.',
    p2: "Teriyaki Turf is those notes, turned into a system. It's what I wish existed when I was Googling \"why is my grass dying in July\" at midnight.",
    p3: "Everything here is specific to KC's clay soil, Zone 6a winters, and the brutal humidity of a Midwest summer. No generic advice. No sponsored garbage. Just what actually works.",
    p4: 'My husband Trever — Teriyaki T — has been out there with me for every renovation, every failure, and every time something finally clicked. This is a real KC household doing real KC lawn work. Not a lawn company. Not a brand deal. Just us and a lot of notes.',
    cred: [
      { num: '8+', label: 'Years of Real KC Lawn Data' },
      { num: '3',  label: 'Full Lawn Renovations (1 Spectacular Failure)' },
      { num: '0',  label: 'Paid Sponsorships. Ever.' },
    ],
  },
  stats: [
    { num: '17+', label: 'KC-Specific FAQ Answers' },
    { num: '12',  label: 'Months Covered' },
    { num: '7',   label: 'Free Tools' },
    { num: '0',   label: 'Paid Sponsorships' },
  ],
}

function deepMerge(defaults, saved) {
  if (!saved) return JSON.parse(JSON.stringify(defaults))
  const out = JSON.parse(JSON.stringify(defaults))
  for (const key of Object.keys(defaults)) {
    if (saved[key] === undefined) continue
    if (Array.isArray(defaults[key])) {
      out[key] = defaults[key].map((def, i) =>
        saved[key]?.[i] !== undefined
          ? (typeof def === 'object' ? { ...def, ...saved[key][i] } : saved[key][i])
          : def
      )
    } else if (typeof defaults[key] === 'object') {
      out[key] = deepMerge(defaults[key], saved[key])
    } else {
      out[key] = saved[key] ?? defaults[key]
    }
  }
  return out
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="card mb-5">
      <h3 className="section-title mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Collapse({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-tt-lime/20 rounded-xl mb-3 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-tt-light-lime/40 hover:bg-tt-light-lime/70 transition-colors text-left"
      >
        <span className="font-semibold text-tt-forest text-sm">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-tt-forest/50" /> : <ChevronRight className="w-4 h-4 text-tt-forest/50" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input w-full h-24 resize-none text-sm" />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input w-full text-sm" />
      }
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminPanel({ onLock }) {
  const [storedPw, setStoredPw] = useLocalStorage('tt_admin_pw', DEFAULT_PASSWORD)
  const [announcement, setAnnouncement] = useLocalStorage('tt_announcement', null)
  const [customTips, setCustomTips] = useLocalStorage('tt_custom_tips', [])
  const [seasonalOverrides, setSeasonalOverrides] = useLocalStorage('tt_seasonal_overrides', {})
  const [savedPageContent, setSavedPageContent] = useLocalStorage('tt_page_content', {})

  // Password change
  const [newPw, setNewPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  // Announcement draft
  const [annDraft, setAnnDraft] = useState(announcement ?? { type: 'info', title: '', body: '' })

  // Seasonal bar draft
  const [seasonDraft, setSeasonDraft] = useState(() => {
    const base = {}
    for (let i = 0; i < 12; i++) base[i] = seasonalOverrides[i] ?? ''
    return base
  })

  // Page content draft — merge saved overrides with defaults
  const [page, setPage] = useState(() => deepMerge(PAGE_DEFAULTS, savedPageContent))
  const [pageSaved, setPageSaved] = useState(false)

  // ── Password ──────────────────────────────────────────────────────────────
  function savePassword() {
    if (!newPw.trim() || newPw.trim().length < 6) return
    setStoredPw(newPw.trim())
    setNewPw('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  // ── Announcement ──────────────────────────────────────────────────────────
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

  // ── Custom tips ───────────────────────────────────────────────────────────
  function addTip() { setCustomTips(prev => [...prev, BLANK_TIP()]) }
  function updateTip(id, field, value) {
    setCustomTips(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }
  function deleteTip(id) { setCustomTips(prev => prev.filter(t => t.id !== id)) }

  // ── Seasonal bar ──────────────────────────────────────────────────────────
  function saveSeasonalOverrides() {
    const cleaned = {}
    for (let i = 0; i < 12; i++) {
      if (seasonDraft[i]?.trim()) cleaned[i] = seasonDraft[i].trim()
    }
    setSeasonalOverrides(cleaned)
    alert('Seasonal overrides saved. Reload the landing page to see changes.')
  }
  function clearSeasonalOverride(i) {
    setSeasonDraft(prev => ({ ...prev, [i]: '' }))
    setSeasonalOverrides(prev => { const n = { ...prev }; delete n[i]; return n })
  }

  // ── Page content ──────────────────────────────────────────────────────────
  function setHero(field, val) { setPage(p => ({ ...p, hero: { ...p.hero, [field]: val } })) }
  function setLeadSub(val) { setPage(p => ({ ...p, lead: { ...p.lead, sub: val } })) }
  function setLeadItem(i, val) {
    setPage(p => {
      const item = [...p.lead.item]
      item[i] = val
      return { ...p, lead: { ...p.lead, item } }
    })
  }
  function setAbout(field, val) { setPage(p => ({ ...p, about: { ...p.about, [field]: val } })) }
  function setAboutCred(i, field, val) {
    setPage(p => {
      const cred = p.about.cred.map((c, idx) => idx === i ? { ...c, [field]: val } : c)
      return { ...p, about: { ...p.about, cred } }
    })
  }
  function setStat(i, field, val) {
    setPage(p => {
      const stats = p.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
      return { ...p, stats }
    })
  }

  function savePageContent() {
    setSavedPageContent(page)
    setPageSaved(true)
    setTimeout(() => setPageSaved(false), 2500)
  }

  function resetPageContent() {
    const fresh = JSON.parse(JSON.stringify(PAGE_DEFAULTS))
    setPage(fresh)
    setSavedPageContent({})
  }

  // ── Render ────────────────────────────────────────────────────────────────
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

      {/* ── PAGE EDITOR ─────────────────────────────────────────────────── */}
      <Section title="📝 Page Editor">
        <div className="mb-4 p-3 bg-tt-light-lime rounded-xl border border-tt-lime/30 text-sm text-tt-forest/80">
          Edit text on the landing page. Leave any field blank to keep the default. Click <strong>Save Page Changes</strong> when done — then reload the landing page to see updates.
        </div>

        <Collapse title="🦸 Hero Section">
          <Field label="Eyebrow (small text above headline)"
            value={page.hero.eyebrow}
            onChange={v => setHero('eyebrow', v)}
            placeholder={PAGE_DEFAULTS.hero.eyebrow} />
          <div className="grid grid-cols-3 gap-2">
            <Field label='Headline — before highlight'
              value={page.hero.headlineBefore}
              onChange={v => setHero('headlineBefore', v)}
              placeholder={PAGE_DEFAULTS.hero.headlineBefore} />
            <Field label='Highlight word (orange)'
              value={page.hero.headlineHighlight}
              onChange={v => setHero('headlineHighlight', v)}
              placeholder={PAGE_DEFAULTS.hero.headlineHighlight} />
            <Field label='After highlight'
              value={page.hero.headlineAfter}
              onChange={v => setHero('headlineAfter', v)}
              placeholder={PAGE_DEFAULTS.hero.headlineAfter} />
          </div>
          <Field label="Subheadline" multiline
            value={page.hero.sub}
            onChange={v => setHero('sub', v)}
            placeholder={PAGE_DEFAULTS.hero.sub} />
        </Collapse>

        <Collapse title="📊 Stats Bar">
          {page.stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-8 text-center font-bold text-tt-charcoal/40 text-sm mt-2.5">#{i+1}</div>
              <input type="text" value={s.num} onChange={e => setStat(i, 'num', e.target.value)}
                placeholder={PAGE_DEFAULTS.stats[i].num}
                className="input w-24 text-sm font-bold" />
              <input type="text" value={s.label} onChange={e => setStat(i, 'label', e.target.value)}
                placeholder={PAGE_DEFAULTS.stats[i].label}
                className="input flex-1 text-sm" />
            </div>
          ))}
        </Collapse>

        <Collapse title="📅 Lead Magnet">
          <Field label="Subheadline"
            value={page.lead.sub}
            onChange={setLeadSub}
            placeholder={PAGE_DEFAULTS.lead.sub} />
          <p className="text-xs text-tt-charcoal/50 font-semibold mt-1">Checklist items (the ✓ bullet points):</p>
          {page.lead.item.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-tt-orange font-bold flex-shrink-0">✓</span>
              <input type="text" value={item.trimStart()} onChange={e => setLeadItem(i, ' ' + e.target.value)}
                placeholder={PAGE_DEFAULTS.lead.item[i].trimStart()}
                className="input flex-1 text-sm" />
            </div>
          ))}
        </Collapse>

        <Collapse title="👩 About Section">
          <Field label="Paragraph 1" multiline value={page.about.p1} onChange={v => setAbout('p1', v)} placeholder="Paragraph 1..." />
          <Field label="Paragraph 2" multiline value={page.about.p2} onChange={v => setAbout('p2', v)} placeholder="Paragraph 2..." />
          <Field label="Paragraph 3" multiline value={page.about.p3} onChange={v => setAbout('p3', v)} placeholder="Paragraph 3..." />
          <Field label="Paragraph 4" multiline value={page.about.p4} onChange={v => setAbout('p4', v)} placeholder="Paragraph 4..." />
          <p className="text-xs text-tt-charcoal/50 font-semibold mt-1">Credential badges:</p>
          {page.about.cred.map((c, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input type="text" value={c.num} onChange={e => setAboutCred(i, 'num', e.target.value)}
                placeholder={PAGE_DEFAULTS.about.cred[i].num}
                className="input w-20 text-sm font-bold" />
              <input type="text" value={c.label} onChange={e => setAboutCred(i, 'label', e.target.value)}
                placeholder={PAGE_DEFAULTS.about.cred[i].label}
                className="input flex-1 text-sm" />
            </div>
          ))}
        </Collapse>

        <div className="flex gap-2 mt-4">
          <button onClick={savePageContent} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
            <Save className="w-4 h-4" /> {pageSaved ? '✓ Saved! Reload landing page' : 'Save Page Changes'}
          </button>
          <button onClick={resetPageContent} className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">
            Reset to Defaults
          </button>
        </div>
      </Section>

      {/* ── ANNOUNCEMENT ─────────────────────────────────────────────────── */}
      <Section title="📢 Dashboard Announcement">
        <p className="text-sm text-tt-charcoal/60 mb-4">
          Pinned card at the top of the Dashboard tab. Leave both fields blank to hide it.
        </p>
        <div className="space-y-3">
          <div>
            <label className="label">Type</label>
            <select value={annDraft.type} onChange={e => setAnnDraft(p => ({ ...p, type: e.target.value }))} className="input w-full">
              {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input type="text" value={annDraft.title} onChange={e => setAnnDraft(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. 🚨 Pre-Emergent Window Now Open" className="input w-full" />
          </div>
          <div>
            <label className="label">Body</label>
            <textarea value={annDraft.body} onChange={e => setAnnDraft(p => ({ ...p, body: e.target.value }))}
              placeholder="e.g. Soil temps hit 50°F in Johnson County today. Apply pre-emergent NOW."
              className="input w-full h-20 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={saveAnnouncement} className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
              <Save className="w-4 h-4" /> Publish
            </button>
            <button onClick={clearAnnouncement} className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">Clear</button>
          </div>
          {announcement && <p className="text-xs text-tt-lime font-semibold">✓ Announcement is live on the Dashboard.</p>}
        </div>
      </Section>

      {/* ── CUSTOM TIPS ──────────────────────────────────────────────────── */}
      <Section title="💡 Custom Dashboard Tips">
        <p className="text-sm text-tt-charcoal/60 mb-4">Pinned to the top of Live Lawn Tips. Saved automatically as you type.</p>
        {customTips.length === 0 && <p className="text-sm text-tt-charcoal/40 italic mb-3">No custom tips yet.</p>}
        {customTips.map((tip) => (
          <div key={tip.id} className="border border-tt-lime/20 rounded-xl p-4 mb-3 space-y-2">
            <div className="flex gap-2">
              <select value={tip.type} onChange={e => updateTip(tip.id, 'type', e.target.value)} className="input text-sm py-1.5 w-32">
                {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label.split(' ')[0]}</option>)}
              </select>
              <input type="text" value={tip.title} onChange={e => updateTip(tip.id, 'title', e.target.value)}
                placeholder="Tip title" className="input flex-1 text-sm py-1.5" />
              <button onClick={() => deleteTip(tip.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea value={tip.body} onChange={e => updateTip(tip.id, 'body', e.target.value)}
              placeholder="Tip body text" className="input w-full h-16 text-sm resize-none" />
          </div>
        ))}
        <button onClick={addTip} className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Custom Tip
        </button>
      </Section>

      {/* ── SEASONAL BAR ─────────────────────────────────────────────────── */}
      <Section title="🌿 Seasonal Bar Overrides (Landing Page)">
        <p className="text-sm text-tt-charcoal/60 mb-4">
          Override the orange alert bar on the landing page. Leave blank for defaults.
        </p>
        <div className="space-y-3">
          {MONTH_NAMES.map((name, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="label mt-2.5 w-24 flex-shrink-0">{name}</span>
              <input type="text" value={seasonDraft[i] ?? ''}
                onChange={e => setSeasonDraft(prev => ({ ...prev, [i]: e.target.value }))}
                placeholder="Leave blank for default" className="input flex-1 text-sm" />
              {seasonalOverrides[i] && (
                <button onClick={() => clearSeasonalOverride(i)} title="Reset to default"
                  className="mt-2 text-tt-charcoal/40 hover:text-red-500 transition-colors">
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

      {/* ── PASSWORD ─────────────────────────────────────────────────────── */}
      <Section title="🔑 Change Password">
        <p className="text-sm text-tt-charcoal/60 mb-3">Minimum 6 characters. Default: <code className="bg-gray-100 px-1 rounded text-xs">teriyakiturf2026</code></p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
              placeholder="New password" className="input w-full pr-10" />
            <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tt-charcoal/40 hover:text-tt-charcoal">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={savePassword} className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
            {pwSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </Section>

    </div>
  )
}
