import { useState, useMemo } from 'react'
import { ShoppingBag, Plus, Edit2, Trash2, Lock, Unlock, Shield, ExternalLink, Tag, Package } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// !! Change this to your desired admin password !!
const ADMIN_PASSWORD = "teriyakiturf2026"

const CATEGORIES = ['All', 'Fertilizer', 'Herbicide', 'Seed', 'Pest Control', 'Soil Amendment', 'Tools', 'Watering']

function placeholderSvg(category) {
  const palette = {
    'Fertilizer':     ['#E8F5E9', '#52B788'],
    'Herbicide':      ['#FFF4E6', '#FF6B35'],
    'Seed':           ['#E8F5E9', '#1B4332'],
    'Pest Control':   ['#FFF4E6', '#e55a28'],
    'Soil Amendment': ['#FEF9EC', '#c8960c'],
    'Tools':          ['#F0F4F8', '#2C3E50'],
    'Watering':       ['#EEF7FF', '#2e86de'],
  }
  const [bg, fg] = palette[category] || ['#E8F5E9', '#52B788']
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='${bg}'/><rect x='72' y='30' width='56' height='72' rx='10' fill='${fg}' opacity='0.4'/><rect x='84' y='20' width='32' height='12' rx='4' fill='${fg}' opacity='0.3'/><text x='100' y='122' font-family='Montserrat,sans-serif' font-size='11' fill='${fg}' text-anchor='middle' font-weight='700' opacity='0.8'>${category}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Scotts Turf Builder Triple Action', description: 'Feeds, prevents crabgrass, and kills weeds in one step. Ideal for spring application in KC Zone 6a. Contains pendimethalin for pre-emergent control. Covers up to 4,000 sq ft.', category: 'Fertilizer', image: '', link: 'https://www.amazon.com/s?k=Scotts+Turf+Builder+Triple+Action' },
  { id: 'p2', name: 'Pennington Smart Seed Tall Fescue', description: 'Certified tall fescue blend developed for transition zone lawns like KC Zone 6a. Uses 30% less water once established. 3 lb bag covers 750 sq ft for overseeding.', category: 'Seed', image: '', link: 'https://www.amazon.com/s?k=Pennington+Smart+Seed+Tall+Fescue' },
  { id: 'p3', name: 'Milorganite Organic Nitrogen Fertilizer', description: 'Slow-release organic fertilizer — safe to apply during hot weather when synthetics risk burning stressed turf. Great mid-summer option for Bermuda. 36 lb bag covers 2,500 sq ft.', category: 'Fertilizer', image: '', link: 'https://www.amazon.com/s?k=Milorganite+fertilizer' },
  { id: 'p4', name: 'Scotts Halts Crabgrass & Grassy Weed Preventer', description: 'Granular pre-emergent with pendimethalin. Apply when forsythia blooms in KC (late Feb–mid March). Prevents crabgrass, goosegrass, and 20+ other grassy weeds for up to 5 months.', category: 'Herbicide', image: '', link: 'https://www.amazon.com/s?k=Scotts+Halts+Crabgrass+Preventer' },
  { id: 'p5', name: 'BioAdvanced 24-Hour Grub Control', description: 'Granular grub killer and 3-month preventer. Apply May–July when white grubs are active near the soil surface. Water in with 0.5 inch of irrigation immediately after application.', category: 'Pest Control', image: '', link: 'https://www.amazon.com/s?k=BioAdvanced+Grub+Control+Plus' },
  { id: 'p6', name: 'Espoma Organic Garden Lime (Pelletized)', description: 'Fast-acting pelletized lime to correct acidic KC clay soils. Raises pH toward the 6.0–6.5 target for tall fescue. Apply per soil test results. 6 lb bag treats approximately 1,500 sq ft.', category: 'Soil Amendment', image: '', link: 'https://www.amazon.com/s?k=Espoma+Organic+Garden+Lime' },
  { id: 'p7', name: 'Rain Bird 6-Zone Irrigation Timer', description: 'Easy-to-program 6-zone digital controller. Set up early-morning watering schedules to reduce fungal disease risk in KC humid summers. Supports seasonal adjustment and rain delays.', category: 'Watering', image: '', link: 'https://www.amazon.com/s?k=Rain+Bird+6+zone+irrigation+timer' },
  { id: 'p8', name: 'Fiskars Rotary Steel Blade Lawn Edger', description: 'Manual rotary edger for clean bed and driveway edges. Sharp rolled steel disc cuts through KC clay. Crisp edges reduce weed encroachment from beds into turf without chemicals.', category: 'Tools', image: '', link: 'https://www.amazon.com/s?k=Fiskars+Rotary+Steel+Blade+Lawn+Edger' },
]

export default function Products() {
  const [products, setProducts] = useLocalStorage('tt_products', DEFAULT_PRODUCTS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({})

  const filtered = useMemo(() =>
    activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  )

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

  function openProductForm(product = null) {
    setForm(product ? { ...product } : { name: '', description: '', category: 'Fertilizer', image: '', link: '' })
    setEditingProduct(product || 'new')
  }

  function saveProduct() {
    if (!form.name?.trim()) return
    if (editingProduct === 'new') {
      setProducts([...products, { ...form, id: 'cp_' + Date.now() }])
    } else {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...form, id: p.id } : p))
    }
    setEditingProduct(null)
    setForm({})
  }

  function deleteProduct(id) {
    if (window.confirm('Remove this product?')) setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-tt-forest flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-tt-orange" />
          Recommended Products
        </h1>
        <div className="ml-auto flex gap-2">
          {adminUnlocked && (
            <button className="btn-primary flex items-center gap-1.5 text-sm" onClick={() => openProductForm()}>
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
          <button
            onClick={() => adminUnlocked ? setAdminUnlocked(false) : setShowPasswordModal(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${adminUnlocked ? 'bg-tt-forest text-tt-cream' : 'bg-white border border-tt-lime/50 text-tt-charcoal hover:bg-tt-light-lime'}`}
          >
            {adminUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {adminUnlocked ? 'Admin On' : 'Admin'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === cat ? 'bg-tt-forest text-tt-cream shadow-sm' : 'bg-white border border-tt-lime/40 text-tt-charcoal hover:bg-tt-light-lime'}`}
          >
            <Tag className="w-3 h-3" />
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="card flex flex-col p-0 overflow-hidden">
            <div className="w-full h-36 bg-tt-light-lime/40 flex items-center justify-center overflow-hidden">
              <img
                src={product.image || placeholderSvg(product.category)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = placeholderSvg(product.category) }}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-tt-orange bg-tt-light-orange px-2.5 py-0.5 rounded-full mb-2.5 w-fit">
                <Tag className="w-3 h-3" />{product.category}
              </span>
              <h3 className="font-bold text-tt-forest text-sm mb-1.5 leading-snug">{product.name}</h3>
              <p className="text-xs text-tt-charcoal/70 leading-relaxed flex-1 mb-4">{product.description}</p>
              <div className="flex gap-2">
                <a
                  href={product.link || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-primary flex-1 text-sm flex items-center justify-center gap-1.5 ${!product.link ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Shop Now
                </a>
                {adminUnlocked && (
                  <>
                    <button onClick={() => openProductForm(product)} className="p-2.5 border border-tt-lime/40 rounded-xl hover:bg-tt-light-lime transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4 text-tt-forest" />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2.5 border border-red-200 rounded-xl hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 card text-center text-tt-charcoal/40 py-16">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No products in this category.
          </div>
        )}
      </div>

      <p className="text-xs text-tt-charcoal/40 text-center pb-2">Products open in a new tab. Links may be affiliate links that support Teriyaki Turf.</p>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-tt-forest" /><h3 className="font-bold text-tt-forest text-lg">Admin Access</h3></div>
            <input type="password" className="input mb-2" placeholder="Enter admin password" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setPasswordError(false) }} onKeyDown={e => e.key === 'Enter' && attemptAdminUnlock()} autoFocus />
            {passwordError && <p className="text-red-500 text-xs mb-1">Incorrect password.</p>}
            <div className="flex gap-2 mt-4">
              <button className="btn-primary flex-1" onClick={attemptAdminUnlock}>Unlock</button>
              <button className="btn-secondary flex-1" onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(false) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-tt-forest text-lg mb-4">{editingProduct === 'new' ? 'Add New Product' : 'Edit Product'}</h3>
            <div className="space-y-3">
              <div><label className="label">Product Name *</label><input className="input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="label">Category</label>
                <select className="input" value={form.category || 'Fertilizer'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">Description</label><textarea className="input resize-y" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><label className="label">Image URL <span className="font-normal text-tt-charcoal/40">(optional)</span></label><input className="input" value={form.image || ''} placeholder="https://…" onChange={e => setForm(f => ({ ...f, image: e.target.value }))} /></div>
              <div><label className="label">Purchase Link</label><input className="input" value={form.link || ''} placeholder="https://amazon.com/…" onChange={e => setForm(f => ({ ...f, link: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 mt-5">
              <button className="btn-primary flex-1" onClick={saveProduct}>Save Product</button>
              <button className="btn-secondary flex-1" onClick={() => { setEditingProduct(null); setForm({}) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
