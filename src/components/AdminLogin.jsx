import { useState } from 'react'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin({ storedPw, onSuccess }) {
  const [input, setInput] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)

  function attempt(e) {
    e.preventDefault()
    if (input === storedPw) {
      onSuccess()
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="card text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-tt-forest/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-tt-forest" />
          </div>
        </div>
        <h2 className="font-bold text-xl text-tt-forest mb-1">Admin Access</h2>
        <p className="text-sm text-tt-charcoal/50 mb-6">Enter your admin password to continue.</p>
        <form onSubmit={attempt} className="space-y-3">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`input w-full pr-10 ${error ? 'border-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tt-charcoal/40 hover:text-tt-charcoal">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm font-semibold">Incorrect password.</p>}
          <button type="submit" className="btn-primary w-full py-2.5 rounded-lg font-semibold">
            Unlock Admin
          </button>
        </form>
      </div>
    </div>
  )
}
