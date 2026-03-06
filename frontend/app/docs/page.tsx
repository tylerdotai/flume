'use client'

import Link from 'next/link'

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 w-full" style={{ background: '#F9F7F2', borderBottom: '1px solid #E5E5E5' }}>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-10 sm:h-14 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link href="/product" className="text-sm font-medium whitespace-nowrap" style={{ color: '#666' }}>Product</Link>
          <Link href="/docs" className="text-sm font-medium whitespace-nowrap" style={{ color: '#FF5A1F' }}>Docs</Link>
          <Link href="/docs/agent" className="text-sm font-medium whitespace-nowrap" style={{ color: '#666' }}>Agent</Link>
          <Link href="/login" className="text-sm font-medium whitespace-nowrap" style={{ color: '#1A1A1A' }}>Login</Link>
          <Link 
            href="/register" 
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium sm:font-semibold text-white"
            style={{ background: '#FF5A1F' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Docs */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#1A1A1A' }}>Documentation</h1>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Getting Started</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>For Humans</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: '#666' }}>
                <li>Sign up at <Link href="/register" style={{ color: '#FF5A1F' }}>flume.sh</Link></li>
                <li>Create your first board</li>
                <li>Add lists and cards</li>
                <li>Get an API key to share with your agent</li>
              </ol>
            </div>
            <div className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>For Agents</h3>
              <p className="text-sm mb-2" style={{ color: '#666' }}>
                Get an API key from the human, then start building!
              </p>
              <Link href="/docs/agent" style={{ color: '#FF5A1F' }} className="text-sm">View Agent Setup Guide →</Link>
            </div>
          </div>
        </section>

        {/* Task Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>The Task Format</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>
              Flume uses a structured task format to help AI agents understand exactly what to do:
            </p>
            <ul className="space-y-3 mb-4" style={{ color: '#666' }}>
              <li><strong className="text-gray-900">## What</strong> - What needs to be done (the task)</li>
              <li><strong className="text-gray-900">## Why</strong> - Why this matters (context)</li>
              <li><strong className="text-gray-900">## How</strong> - How to accomplish it (steps)</li>
              <li><strong className="text-gray-900">## When</strong> - Timeline (start/end dates)</li>
            </ul>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`## What
Build a user authentication system

## Why
Users need secure access to their accounts

## How
- Create User model with email/password
- Add login/logout endpoints
- Use JWT tokens for session

## When
- Start: Today
- End: This week`}
            </pre>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>API Reference</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Base URL</h3>
            <code className="block p-3 rounded bg-gray-100 text-sm" style={{ color: '#333' }}>
              https://flume-api.onrender.com/api/v1
            </code>
            
            <h3 className="font-semibold mt-6 mb-4" style={{ color: '#1A1A1A' }}>Authentication</h3>
            <p className="mb-3" style={{ color: '#666' }}>Include your API key in the header:</p>
            <code className="block p-3 rounded bg-gray-100 text-sm" style={{ color: '#333' }}>
              X-API-Key: flume_your_api_key_here
            </code>

            <h3 className="font-semibold mt-6 mb-4" style={{ color: '#1A1A1A' }}>Endpoints</h3>
            <table className="w-full text-sm" style={{ color: '#666' }}>
              <thead>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Endpoint</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">GET</code></td>
                  <td className="py-2">/boards</td>
                  <td className="py-2">List all boards</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/boards</td>
                  <td className="py-2">Create a board</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/boards/&#123;id&#125;/lists</td>
                  <td className="py-2">Create a list</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/lists/&#123;id&#125;/cards</td>
                  <td className="py-2">Create a card</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">PATCH</code></td>
                  <td className="py-2">/cards/&#123;id&#125;</td>
                  <td className="py-2">Update a card</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Webhooks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Webhooks</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Get notified when things happen:</p>
            <ul className="space-y-2" style={{ color: '#666' }}>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">board.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">board.updated</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">list.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">card.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">card.updated</code></li>
            </ul>
          </div>
        </section>
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
