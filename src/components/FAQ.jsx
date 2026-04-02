import { useState, useMemo } from 'react'
import {
  ChevronDown, ChevronUp, Search, Plus, Edit2, Trash2,
  Lock, Unlock, Lightbulb, HelpCircle, Shield,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// !! Change this to your desired admin password !!
const ADMIN_PASSWORD = "teriyakiturf2026"

const DEFAULT_FAQS = [
  {
    id: 'f1', section: 'Watering & Irrigation',
    question: 'How much should I water my lawn in Kansas City summers?',
    answer: 'Tall fescue needs 1–1.5 inches of water per week during Kansas City\'s hot July–August heat. Water 2–3 times per week in early morning (5–9 AM) rather than daily shallow watering. Bermuda and Zoysia need about 1 inch per week. Avoid evening watering — wet foliage overnight is a leading cause of brown patch and dollar spot in KC\'s humid summers.',
  },
  {
    id: 'f2', section: 'Watering & Irrigation',
    question: 'When is the best time of day to water my lawn?',
    answer: 'Always water between 5–9 AM. Early morning watering allows foliage to dry before nightfall, dramatically reducing fungal disease risk. Evening watering leaves foliage wet all night — the primary cause of brown patch outbreaks on tall fescue in Kansas City. Mid-day watering wastes water through evaporation but will not cause disease.',
  },
  {
    id: 'f3', section: 'Watering & Irrigation',
    question: 'How do I know if I\'m watering enough?',
    answer: 'Place a tuna can in the irrigation zone and run your system until it collects 1 inch of water — that\'s your calibration. Alternatively, push a screwdriver 6 inches into the soil after watering: if it meets strong resistance before 6 inches, the soil is too dry. Footprints that stay compressed for more than 30 minutes indicate drought stress.',
  },
  {
    id: 'f4', section: 'Fertilizing & Soil',
    question: 'What is the Johnson County fertilizer blackout period?',
    answer: 'Johnson County, KS prohibits fertilizer applications from November 1 through February 28 (the blackout lifts March 1). Many other KC metro municipalities have similar ordinances. Violations can result in fines. Plan your last fall application before October 31 — this timing also aligns with the ideal winterizer window for tall fescue.',
  },
  {
    id: 'f5', section: 'Fertilizing & Soil',
    question: 'How often should I fertilize tall fescue in Kansas City?',
    answer: 'Tall fescue follows a 4-application schedule: (1) March 1 at 0.5–1 lb N/1,000 sqft as growth resumes; (2) May at 1 lb N/1,000 sqft — last spring feeding; (3) September at 1 lb N/1,000 sqft — most important application; (4) Late October (before Nov 1 blackout) at 1 lb N/1,000 sqft winterizer. Never fertilize cool-season grass June–August.',
  },
  {
    id: 'f6', section: 'Fertilizing & Soil',
    question: 'How do I deal with Kansas City\'s heavy clay soil?',
    answer: 'KC\'s clay compacts easily and drains poorly. The best long-term fix is annual fall core aeration (two perpendicular passes) combined with topdressing with compost. Do NOT add sand — sand mixed with clay creates a near-concrete texture. A K-State Extension soil test will guide amendments precisely. Target pH 6.0–6.5 for tall fescue on clay soils.',
  },
  {
    id: 'f7', section: 'Mowing',
    question: 'What is the correct mowing height for tall fescue?',
    answer: 'Mow tall fescue at 3–3.5 inches in spring and fall. Raise to 4 inches for summer (June–August) to shade the soil, conserve moisture, and reduce heat stress. Never remove more than 1/3 of the blade in a single pass — this single rule prevents more turf damage than anything else. Mowing at 4 inches vs. 2.5 inches can cut water needs by 30–40% in KC summers.',
  },
  {
    id: 'f8', section: 'Mowing',
    question: 'Should I bag my grass clippings or leave them?',
    answer: 'Leave clippings (grasscycling) whenever you mow on schedule and remove no more than 1/3 of the blade. Clippings decompose in 3–5 days, returning the equivalent of one free fertilizer application per season. Only bag when grass is excessively tall, wet, or diseased (e.g., active brown patch). Clippings do NOT cause thatch in properly maintained lawns.',
  },
  {
    id: 'f9', section: 'Seeding & Overseeding',
    question: 'When is the best time to overseed tall fescue in Kansas City?',
    answer: 'The prime window for tall fescue overseeding in KC Zone 6a is August 15 – September 15. Soil temps at 65–75°F + cooling nights + fall rains produce germination rates 3–4× higher than spring seeding. Slit seeding dramatically outperforms broadcast seeding. Water 2–3× daily until germination (7–14 days). Fall-seeded fescue has a full winter to root before summer heat arrives.',
  },
  {
    id: 'f10', section: 'Seeding & Overseeding',
    question: 'Can I seed in spring instead of fall?',
    answer: 'Spring seeding is a compromise. Fescue seeded in April has only 8–10 weeks before KC\'s summer heat stress arrives — many seedlings die before establishing. If you must seed in spring, do it by March 15 at the latest. Important: you cannot seed 8–12 weeks after applying a pre-emergent herbicide. Fall is always the correct primary window for cool-season grasses in KC.',
  },
  {
    id: 'f11', section: 'Seeding & Overseeding',
    question: 'How do I fix bare spots in my lawn?',
    answer: 'For spots under 10 sq ft: loosen soil 2–3 inches, apply starter fertilizer, seed at 2× overseeding rate, cover lightly with straw or seed-starting mix, and water 2–3× daily. For larger areas: rent a slit seeder — it outperforms broadcast seeding dramatically. Seed tall fescue in late August–September. Spring repairs are harder since heat stress kills new seedlings before establishment.',
  },
  {
    id: 'f12', section: 'Pest & Disease Control',
    question: 'What are the signs of brown patch fungus?',
    answer: 'Brown patch (Rhizoctonia solani) appears as circular tan/brown patches 6 inches to 3+ feet in diameter, sometimes with a darker smoke ring border. It\'s most common on tall fescue during hot, humid KC nights (above 70°F) combined with days above 85°F. Risk spikes with evening irrigation. Apply azoxystrobin or propiconazole preventively when conditions persist for 3+ consecutive days.',
  },
  {
    id: 'f13', section: 'Pest & Disease Control',
    question: 'How do I know if I have grubs and what should I do?',
    answer: 'Signs of grub damage: (1) spongy turf that lifts like carpet, (2) brown patches that don\'t respond to watering, (3) birds, skunks, or raccoons digging. Confirm by cutting a 1-sq-ft section 3 inches deep — 5 or more grubs warrants treatment. Apply imidacloprid (Merit) in May–June or chlorantraniliprole (Acelepryn) in April–May before eggs hatch. Always water in immediately.',
  },
  {
    id: 'f14', section: 'Pest & Disease Control',
    question: 'Why does my fescue turn brown in July and August?',
    answer: 'Tall fescue is a cool-season grass and naturally goes semi-dormant in KC\'s July–August heat (90°F+). The brown color is a drought/heat survival mechanism — the grass is alive, not dead. Maintain at least 0.5 inch/week to sustain dormancy without killing turf. Do not fertilize dormant fescue. It will green up naturally in September when temperatures cool.',
  },
  {
    id: 'f15', section: 'General KC Lawn Care',
    question: 'When should I apply pre-emergent in Kansas City?',
    answer: 'Apply pre-emergent when forsythia reaches full bloom — this natural indicator aligns with soil reaching 50–55°F at 2-inch depth, the germination trigger for crabgrass. In KC Zone 6a, this typically falls late February through mid-March. Use pendimethalin, prodiamine, or dithiopyr. A second application 6–8 weeks later extends protection through summer.',
  },
  {
    id: 'f16', section: 'General KC Lawn Care',
    question: 'What is core aeration and does my KC lawn need it?',
    answer: 'Core aeration removes plugs of soil, relieving compaction and improving water/air/nutrient penetration. With KC\'s heavy clay soils, annual fall aeration (late August–September) is strongly recommended. Two perpendicular passes on dense clay. Leave cores to dissolve on the surface. Aeration dramatically improves fall overseeding success — always aerate before overseeding.',
  },
  {
    id: 'f17', section: 'General KC Lawn Care',
    question: 'What is the best grass type for Kansas City?',
    answer: 'Tall fescue is the #1 grass for KC Zone 6a — tolerates both cold winters and hot summers, adapts to clay soils, and maintains color through most of the season. Zoysia is excellent in sunny areas with less water/fertilizer once established (3–5 year establishment). Bermuda grows fast but goes dormant/tan October–April. Kentucky bluegrass needs high water and care in KC summers.',
  },
]

const DEFAULT_TIPS = [
  { id: 't1', icon: '🌸', title: 'Use Forsythia as Your Calendar', body: 'When forsythia shrubs bloom yellow in KC, soil temps hit 50°F — your pre-emergent window is open. This natural timing indicator is more reliable than calendar dates, which shift year to year with the weather.' },
  { id: 't2', icon: '💧', title: 'Never Mow Wet Grass', body: 'Mowing wet grass tears blades instead of cutting cleanly, spreads fungal spores across the lawn, and causes clumps that smother turf. Wait until the morning dew dries — usually by 9–10 AM on summer mornings.' },
  { id: 't3', icon: '☀️', title: 'Raise Your Mowing Height in Summer', body: 'Raising tall fescue from 3 to 4 inches in June can reduce water needs by 30–40%. Taller grass shades the soil, slows evaporation, and stays cooler — critical for KC\'s 95°F+ July heat waves.' },
  { id: 't4', icon: '⚙️', title: 'Sharpen Mower Blades Twice Per Season', body: 'A dull blade shreds grass tips instead of cutting cleanly. Shredded tips turn white/tan within days and become entry points for fungal disease. Sharpen at the start of spring and again in mid-summer.' },
  { id: 't5', icon: '🧪', title: 'Soil Test Before You Fertilize', body: 'A K-State Extension soil test costs $20–25 and tells you exactly what your soil needs. Most KC lawns on clay are high in phosphorus — adding more wastes money and pollutes waterways. Test every 2–3 years.' },
  { id: 't6', icon: '🌿', title: 'Water Deeply, Not Daily', body: 'Watering 0.5 inch every day trains roots to stay shallow. Watering 1 inch twice a week pushes roots 4–6 inches deep, where soil stays cooler and moister. Deep-rooted turf survives KC droughts that shallow-rooted lawns cannot.' },
  { id: 't7', icon: '♻️', title: 'Leave the Clippings', body: 'Grasscycling returns up to 1 lb of nitrogen per 1,000 sqft per season — equivalent to one free fertilizer application. Clippings decompose in 3–5 days and do not cause thatch in properly maintained lawns.' },
  { id: 't8', icon: '❄️', title: 'Mark Your Irrigation Heads Before Winter', body: 'Before winterizing, photograph or sketch your head layout and zone coverage. KC\'s freeze-thaw cycles shift heads and pop-ups over the winter. Knowing where each head should be saves hours of troubleshooting at spring startup.' },
  { id: 't9', icon: '🚫', title: 'Never Fertilize Dormant Fescue', body: 'Applying nitrogen to heat-stressed or dormant tall fescue in July–August is one of the most common KC lawn mistakes. The grass cannot use it, weeds love it, and it invites fungal disease. Wait until September when temps drop below 75°F.' },
  { id: 't10', icon: '🌱', title: 'Aerate Before You Overseed', body: 'Core aeration before fall overseeding improves germination rates by 40–60% on compacted KC clay. Aeration holes give seeds direct soil contact with less competition. Always aerate first, then slit-seed — never skip this step.' },
]

export default function FAQ() {
  const [faqs, setFaqs] = useLocalStorage('tt_faqs', DEFAULT_FAQS)
  const [tips, setTips] = useLocalStorage('tt_tips', DEFAULT_TIPS)
  const [openIds, setOpenIds] = useState({})
  const [search, setSearch] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [editingTip, setEditingTip] = useState(null)
  const [form, setForm] = useState({})

  const sections = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = q
      ? faqs.filter(f =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.section.toLowerCase().includes(q)
        )
      : faqs
    return filtered.reduce((acc, faq) => {
      acc[faq.section] = acc[faq.section] ? [...acc[faq.section], faq] : [faq]
      return acc
    }, {})
  }, [faqs, search])

  const filteredTips = useMemo(() => {
    if (!search) return tips
    const q = search.toLowerCase()
    return tips.filter(t => t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q))
  }, [tips, search])

  function toggleAccordion(id) {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function attemptAdminUnlock() {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true)
      setShowPasswordModal(false)
      setPasswordInput('')
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  function openFaqForm(faq = null) {
    setForm(faq ? { ...faq } : { section: 'General KC Lawn Care', question: '', answer: '' })
    setEditingFaq(faq || 'new')
  }

  function saveFaq() {
    if (!form.question?.trim() || !form.answer?.trim()) return
    if (editingFaq === 'new') {
      setFaqs([...faqs, { ...form, id: 'cf_' + Date.now() }])
    } else {
      setFaqs(faqs.map(f => f.id === editingFaq.id ? { ...form, id: f.id } : f))
    }
    setEditingFaq(null)
    setForm({})
  }

  function deleteFaq(id) {
    setFaqs(faqs.filter(f => f.id !== id))
  }

  function openTipForm(tip = null) {
    setForm(tip ? { ...tip } : { icon: '💡', title: '', body: '' })
    setEditingTip(tip || 'new')
  }

  function saveTip() {
    if (!form.title?.trim() || !form.body?.trim()) return
    if (editingTip === 'new') {
      setTips([...tips, { ...form, id: 'ct_' + Date.now() }])
    } else {
      setTips(tips.map(t => t.id === editingTip.id ? { ...form, id: t.id } : t))
    }
    setEditingTip(null)
    setForm({})
  }

  function deleteTip(id) {
    setTips(tips.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Search + admin toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tt-charcoal/40 pointer-events-none" />
          <input
            className="input pl-10"
            placeholder="Search FAQs and tips…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => adminUnlocked ? setAdminUnlocked(false) : setShowPasswordModal(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            adminUnlocked
              ? 'bg-tt-forest text-tt-cream'
              : 'bg-white border border-tt-lime/50 text-tt-charcoal hover:bg-tt-light-lime'
          }`}
        >
          {adminUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {adminUnlocked ? 'Admin On' : 'Admin'}
        </button>
        {adminUnlocked && (
          <button className="btn-primary flex items-center gap-1.5 text-sm" onClick={() => openFaqForm()}>
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        )}
      </div>

      {/* FAQ accordion sections */}
      {Object.keys(sections).length === 0 && (
        <div className="card text-center text-tt-charcoal/50 py-12">No FAQs match your search.</div>
      )}

      {Object.entries(sections).map(([section, sectionFaqs]) => (
        <div key={section} className="card">
          <h2 className="section-title">
            <HelpCircle className="w-5 h-5 text-tt-orange" />
            {section}
          </h2>
          <div className="space-y-2">
            {sectionFaqs.map(faq => (
              <div key={faq.id} className="border border-tt-lime/25 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-tt-light-lime/60 hover:bg-tt-light-lime transition-colors"
                  onClick={() => toggleAccordion(faq.id)}
                >
                  <span className="font-semibold text-tt-forest text-sm leading-snug">{faq.question}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {adminUnlocked && (
                      <>
                        <span
                          className="p-1.5 rounded-lg hover:bg-tt-orange/10 hover:text-tt-orange text-tt-charcoal/50 transition-colors"
                          onClick={e => { e.stopPropagation(); openFaqForm(faq) }}
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </span>
                        <span
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-tt-charcoal/50 transition-colors"
                          onClick={e => { e.stopPropagation(); deleteFaq(faq.id) }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </span>
                      </>
                    )}
                    {openIds[faq.id]
                      ? <ChevronUp className="w-4 h-4 text-tt-forest" />
                      : <ChevronDown className="w-4 h-4 text-tt-forest" />
                    }
                  </div>
                </button>
                {openIds[faq.id] && (
                  <div className="px-4 py-4 text-sm text-tt-charcoal leading-relaxed bg-white border-t border-tt-lime/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tips & Tricks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <Lightbulb className="w-5 h-5 text-tt-orange" />
            Tips & Tricks
          </h2>
          {adminUnlocked && (
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-tt-forest/60 hover:text-tt-orange transition-colors"
              onClick={() => openTipForm()}
            >
              <Plus className="w-4 h-4" /> Add Tip
            </button>
          )}
        </div>
        {filteredTips.length === 0 && <p className="text-tt-charcoal/40 text-sm">No tips match your search.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTips.map(tip => (
            <div key={tip.id} className="bg-tt-light-lime/60 border border-tt-lime/30 rounded-xl p-4 relative group">
              {adminUnlocked && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-white rounded-lg hover:text-tt-orange shadow-sm border border-tt-lime/20" onClick={() => openTipForm(tip)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-white rounded-lg hover:text-red-500 shadow-sm border border-tt-lime/20" onClick={() => deleteTip(tip.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="text-2xl mb-2">{tip.icon}</div>
              <h4 className="font-bold text-tt-forest text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-tt-charcoal/75 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-tt-forest" />
              <h3 className="font-bold text-tt-forest text-lg">Admin Access</h3>
            </div>
            <input
              type="password"
              className="input mb-2"
              placeholder="Enter admin password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(false) }}
              onKeyDown={e => e.key === 'Enter' && attemptAdminUnlock()}
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-xs mb-1">Incorrect password.</p>}
            <div className="flex gap-2 mt-4">
              <button className="btn-primary flex-1" onClick={attemptAdminUnlock}>Unlock</button>
              <button className="btn-secondary flex-1" onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(false) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ edit/add modal */}
      {editingFaq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-tt-forest text-lg mb-4">
              {editingFaq === 'new' ? 'Add New FAQ' : 'Edit FAQ'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Section</label>
                <input className="input" value={form.section || ''} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="e.g. Watering & Irrigation" />
              </div>
              <div>
                <label className="label">Question</label>
                <input className="input" value={form.question || ''} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
              </div>
              <div>
                <label className="label">Answer</label>
                <textarea className="input resize-y" rows={5} value={form.answer || ''} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary flex-1" onClick={saveFaq}>Save</button>
              <button className="btn-secondary flex-1" onClick={() => { setEditingFaq(null); setForm({}) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tip edit/add modal */}
      {editingTip && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="font-bold text-tt-forest text-lg mb-4">
              {editingTip === 'new' ? 'Add New Tip' : 'Edit Tip'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Icon (emoji)</label>
                <input className="input" value={form.icon || ''} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="💡" />
              </div>
              <div>
                <label className="label">Title</label>
                <input className="input" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Body</label>
                <textarea className="input resize-y" rows={4} value={form.body || ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary flex-1" onClick={saveTip}>Save</button>
              <button className="btn-secondary flex-1" onClick={() => { setEditingTip(null); setForm({}) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
