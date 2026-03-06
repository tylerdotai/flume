'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/board')
    } catch (err: any) {
      setError(err.message || 'Login failed')
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
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome back to Flume
          </h2>
          <p className="text-white/80 text-lg">
            The task manager for humans & AI agents
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: '#FF5A1F' }}></div>
              <span className="text-xl font-bold" style={{ color: '#1A1A1A' }}>flume</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Sign in</h1>
          <p className="mb-8" style={{ color: '#666' }}>
            Don't have an account? <Link href="/register" className="font-semibold" style={{ color: '#FF5A1F' }}>Sign up</Link>
          </p>

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

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm" style={{ color: '#666' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
