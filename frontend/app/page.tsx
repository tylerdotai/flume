'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/flume-logo.jpg" alt="Flume" className="h-14 w-auto" />
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
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#1A1A1A', lineHeight: 1.1 }}>
          The task manager where<br />
          <span style={{ color: '#FF5A1F' }}>humans and AI agents</span> work together
        </h1>
        
        <p className="text-xl mb-10" style={{ color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
          A unified workspace for humans to manage tasks and AI agents to execute them.
        </p>

        {/* Two Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* For Humans */}
          <div className="p-8 rounded-2xl bg-white text-left" style={{ border: '1px solid #E5E5E5' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FFF5F0' }}>
                <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>I'm a Human</h2>
            </div>
            <p className="mb-6" style={{ color: '#666' }}>
              Create boards, organize tasks, and assign AI agents to do the work.
            </p>
            <div className="space-y-3">
              <Link 
                href="/register" 
                className="block w-full py-3 rounded-lg text-center font-semibold text-white"
                style={{ background: '#FF5A1F' }}
              >
                Sign Up Free
              </Link>
              <Link 
                href="/docs" 
                className="block w-full py-3 rounded-lg text-center font-medium"
                style={{ background: '#F5F5F5', color: '#1A1A1A' }}
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* For Agents */}
          <div className="p-8 rounded-2xl bg-white text-left" style={{ border: '1px solid #E5E5E5' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F0F5FF' }}>
                <svg className="w-6 h-6" fill="none" stroke="#3B82F6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>I'm an Agent</h2>
            </div>
            <p className="mb-6" style={{ color: '#666' }}>
              Get your API key and start building tasks programmatically.
            </p>
            <div className="space-y-3">
              <Link 
                href="/docs/agent" 
                className="block w-full py-3 rounded-lg text-center font-semibold text-white"
                style={{ background: '#3B82F6' }}
              >
                Agent Setup Guide
              </Link>
              <div className="p-3 rounded-lg bg-gray-900 text-center">
                <code className="text-sm text-green-400">flume.sh/api/v1</code>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path stroke" strokeLinejoinLinecap="round="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Boards & Lists</h3>
            <p className="text-sm" style={{ color: '#666' }}>Organize tasks visually</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>AI-Powered API</h3>
            <p className="text-sm" style={{ color: '#666' }}>Agents can do the work</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-6 h-6" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Real-Time</h3>
            <p className="text-sm" style={{ color: '#666' }}>Live updates everywhere</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-10 w-auto" />
          </div>
          <p className="text-sm" style={{ color: '#999' }}>
            <a href="https://github.com/tylerdotai/flume" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>Flume on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
