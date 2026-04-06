import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, MapPin, Camera, Save, LogOut, ArrowLeft, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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

export default function Profile() {
  const { user, updateProfile, updateAvatar, logout } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    zipCode: user?.zipCode || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!form.name || !form.email) {
      setMessage({ type: 'error', text: 'Name and email are required.' })
      return
    }
    if (form.zipCode && !/^\d{5}$/.test(form.zipCode)) {
      setMessage({ type: 'error', text: 'Please enter a valid 5-digit ZIP code.' })
      return
    }

    setSaving(true)
    const result = updateProfile({
      name: form.name,
      email: form.email,
      zipCode: form.zipCode,
    })
    setSaving(false)

    if (result.ok) {
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } else {
      setMessage({ type: 'error', text: result.error })
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 2 MB.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateAvatar(reader.result)
      setMessage({ type: 'success', text: 'Avatar updated.' })
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveAvatar() {
    updateAvatar(null)
    setMessage({ type: 'success', text: 'Avatar removed.' })
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-tt-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-semibold text-tt-forest hover:text-tt-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="section-title text-2xl">
          <User className="w-6 h-6" />
          My Profile
        </h1>

        {/* Avatar section */}
        <div className="card mb-5">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-tt-lime"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-tt-forest flex items-center justify-center text-tt-cream text-xl font-bold border-2 border-tt-lime">
                  {getInitials(user.name)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-tt-forest">{user.name}</h2>
              <p className="text-sm text-tt-charcoal/60">{user.email}</p>
              {user.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs text-tt-orange hover:text-red-600 font-semibold mt-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="card mb-5">
          <h2 className="section-title">
            <Mail className="w-5 h-5" />
            My Info
          </h2>

          {message.text && (
            <div className={message.type === 'success' ? 'tip-success mb-4' : 'tip-warning mb-4'}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Display Name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={form.name}
                onChange={e => update('name', e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={e => update('email', e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="zipCode">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  ZIP Code
                </span>
              </label>
              <input
                id="zipCode"
                type="text"
                className="input"
                placeholder="64108"
                maxLength={5}
                value={form.zipCode}
                onChange={e => update('zipCode', e.target.value.replace(/\D/g, ''))}
              />
              <p className="text-xs text-tt-charcoal/40 mt-1">Personalizes lawn care tips for your neighborhood</p>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="card mb-5">
          <h2 className="section-title">
            <User className="w-5 h-5" />
            Account
          </h2>
          <div className="text-sm text-tt-charcoal/60 space-y-1">
            <p>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
