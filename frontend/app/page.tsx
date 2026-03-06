'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/board')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/flume-logo.jpg" alt="Flume" className="w-8 h-8 rounded-lg" />
          </Link>
          <Link href="/">
            <span className="text-xl font-bold" style={{ color: '#1A1A1A' }}>flume</span>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/product" className="text-sm font-medium" style={{ color: '#666' }}>Product</Link>
          <Link href="/docs" className="text-sm font-medium" style={{ color: '#666' }}>Docs</Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Login</Link>
          <Link 
            href="/register" 
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#FF5A1F' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#1A1A1A', lineHeight: 1.1 }}>
          The task manager where<br />
          <span style={{ color: '#FF5A1F' }}>humans and AI agents</span> work together
        </h1>
        
        <p className="text-xl mb-10" style={{ color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
          A unified workspace where human creativity meets AI efficiency. 
          Connect your favorite AI agents and experience the future of collaboration.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/register" 
            className="px-8 py-4 rounded-lg text-lg font-semibold text-white"
            style={{ background: '#FF5A1F' }}
          >
            Get Started Free
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-4 rounded-lg text-lg font-semibold"
            style={{ background: 'white', border: '1px solid #E5E5E5', color: '#1A1A1A' }}
          >
            Sign In
          </Link>
        </div>

        {/* App Preview */}
        <div className="mt-16 rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E5E5', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="bg-white p-8">
            {/* Mock Kanban */}
            <div className="flex gap-6 overflow-x-auto pb-4">
              {/* Todo List */}
              <div className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#1A1A1A' }}>To Do</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100" style={{ color: '#666' }}>3</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Build authentication</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Design database</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>API endpoints</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#1A1A1A' }}>In Progress</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100" style={{ color: '#666' }}>2</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Frontend setup</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Testing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Done */}
              <div className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#1A1A1A' }}>Done</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100" style={{ color: '#666' }}>5</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border bg-gray-50" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm line-through" style={{ color: '#999' }}>Project setup</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Boards and Lists</h3>
            <p className="text-sm" style={{ color: '#666' }}>Organize tasks with flexible boards and lists</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>AI-Powered</h3>
            <p className="text-sm" style={{ color: '#666' }}>Give tasks to AI agents via API</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Real-Time</h3>
            <p className="text-sm" style={{ color: '#666' }}>Live updates across all devices</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg" style={{ background: '#FF5A1F' }}></div>
            <span className="font-semibold" style={{ color: '#1A1A1A' }}>flume</span>
          </div>
          <p className="text-sm" style={{ color: '#999' }}>
            <a href="https://github.com/tylerdotai/flume" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>Flume on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
