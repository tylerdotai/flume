'use client'

import Link from 'next/link'

export default function Product() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/product" className="text-sm font-medium" style={{ color: '#FF5A1F' }}>Product</Link>
          <Link href="/docs" className="text-sm font-medium" style={{ color: '#666' }}>Docs</Link>
          <Link href="/docs/agent" className="text-sm font-medium" style={{ color: '#666' }}>Agent</Link>
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

      {/* Product Hero */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#1A1A1A' }}>
            Built for the <span style={{ color: '#FF5A1F' }}>AI Era</span>
          </h1>
          <p className="text-xl" style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Flume is a task manager designed from the ground up for human-AI collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>Boards & Lists</h3>
            <p style={{ color: '#666' }}>Organize tasks with Kanban boards. Create lists, add cards, and drag-and-drop to reorder.</p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>AI API</h3>
            <p style={{ color: '#666' }}>Programmatic access for AI agents. Build agents that create boards, lists, and cards automatically.</p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>Real-Time Sync</h3>
            <p style={{ color: '#666' }}>See changes instantly via WebSocket. Multiple users and AI agents can work simultaneously.</p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>Mobile Ready</h3>
            <p style={{ color: '#666' }}>Responsive design works on desktop and mobile. Access your tasks from anywhere.</p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>Webhooks</h3>
            <p style={{ color: '#666' }}>Trigger actions when events happen. Connect Flume to your existing workflows.</p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: '#FFF5F0' }}>
              <svg className="w-5 h-5" fill="none" stroke="#FF5A1F" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1A1A1A' }}>Secure</h3>
            <p style={{ color: '#666' }}>JWT authentication, API keys for agents, and best practices for data protection.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            href="/register" 
            className="inline-block px-8 py-4 rounded-lg text-lg font-semibold text-white"
            style={{ background: '#FF5A1F' }}
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-6 w-auto" />
          </div>
          <p className="text-sm" style={{ color: '#999' }}>
            <a href="https://github.com/tylerdotai/flume" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>Flume on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
