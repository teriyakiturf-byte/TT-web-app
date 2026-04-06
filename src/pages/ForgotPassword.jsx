import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Leaf, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-tt-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tt-forest rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-tt-lime" />
          </div>
          <h1 className="text-2xl font-bold text-tt-forest">Reset Password</h1>
          <p className="text-tt-charcoal/60 text-sm mt-1">
            {submitted
              ? 'Check your email for reset instructions'
              : 'Enter your email and we\'ll send reset instructions'}
          </p>
        </div>

        <div className="card">
          {submitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-tt-light-lime rounded-full mb-4">
                <CheckCircle className="w-7 h-7 text-tt-forest" />
              </div>
              <h2 className="text-lg font-bold text-tt-forest mb-2">Email Sent</h2>
              <p className="text-sm text-tt-charcoal/60 mb-6">
                If an account exists for <span className="font-semibold text-tt-charcoal">{email}</span>,
                you&apos;ll receive password reset instructions shortly.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="tip-warning">{error}</div>
              )}

              <div>
                <label className="label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Send Reset Instructions
              </button>
            </form>
          )}
        </div>

        {!submitted && (
          <p className="text-center text-sm text-tt-charcoal/60 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-tt-forest font-bold hover:text-tt-orange transition-colors">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
