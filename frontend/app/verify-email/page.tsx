'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { verifyEmail } from '@/lib/api'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmailToken()
    }
  }, [token])

  const verifyEmailToken = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const result = await verifyEmail(token)
      setMessage(result.message)
    } catch (err: any) {
      setError(err.message || 'Failed to verify email')
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
            Verify your email
          </h2>
          <p className="text-white/80 text-lg">
            Confirm your email address to get started
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-14 w-auto" style={{ background: '#FF5A1F' }}></div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Email verification</h1>

          {loading && (
            <div className="mt-8">
              <div className="animate-spin rounded-full h-12 w-12 mx-auto border-b-2" style={{ borderColor: '#FF5A1F' }}></div>
              <p className="mt-4" style={{ color: '#666' }}>Verifying your email...</p>
            </div>
          )}

          {message && (
            <div className="mt-8 p-4 rounded-lg" style={{ background: '#ECFDF5', color: '#059669' }}>
              {message}
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 rounded-lg" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {!token && !loading && (
            <div className="mt-8 p-4 rounded-lg" style={{ background: '#FEF2F2', color: '#DC2626' }}>
              Missing verification token. Please check your email for the verification link.
            </div>
          )}

          <div className="mt-8">
            <Link href="/login" className="text-sm" style={{ color: '#FF5A1F' }}>
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
