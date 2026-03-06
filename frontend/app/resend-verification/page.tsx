'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resendVerification } from '@/lib/api'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const result = await resendVerification(email)
      setMessage(String(result.message))
    } catch (err: any) {
      setError(err.message || err.detail || 'Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F9F7F2' }}>
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ background: '#FF5A1F' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Resend verification
          </h2>
          <p className="text-white/80 text-lg">
            Did not receive our email? We will send it again
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-14 w-auto" style={{ background: '#FF5A1F' }}></div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Resend verification email</h1>
          <p className="mb-8" style={{ color: '#666' }}>
            Enter your email address and we will resend the verification link.
          </p>

          {message && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: '#ECFDF5', color: '#059669' }}>
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all"
              style={{ background: '#FF5A1F' }}
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm" style={{ color: '#666' }}>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
