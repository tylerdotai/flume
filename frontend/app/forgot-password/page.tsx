'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
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
      const result = await forgotPassword(email)
      setMessage(result.message)
    } catch (err: any) {
      setError(err.message || err.detail || 'Failed to send reset email')
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
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Reset your password
          </h2>
          <p className="text-white/80 text-lg">
            We will send you a link to reset your password
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

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Forgot password?</h1>
          <p className="mb-8" style={{ color: '#666' }}>
            No problem. Enter your email and we will send you a reset link.
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
              {loading ? 'Sending...' : 'Send reset link'}
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
