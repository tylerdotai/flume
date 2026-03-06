'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/api'

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing reset token. Please use the link from your email.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!token) {
      setError('Missing reset token')
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword(token, password)
      setMessage(result.message + ' Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
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
            Set new password
          </h2>
          <p className="text-white/80 text-lg">
            Choose a strong password to secure your account
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

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Reset password</h1>
          <p className="mb-8" style={{ color: '#666' }}>
            Enter your new password below.
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
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all"
              style={{ background: '#FF5A1F' }}
            >
              {loading ? 'Resetting...' : 'Reset password'}
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
