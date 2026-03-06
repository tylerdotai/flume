'use client'

import Link from 'next/link'

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-12 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/product" className="text-sm font-medium" style={{ color: '#666' }}>Product</Link>
          <Link href="/docs" className="text-sm font-medium" style={{ color: '#FF5A1F' }}>Docs</Link>
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

      {/* Docs */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#1A1A1A' }}>Documentation</h1>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Getting Started</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Quick Start</h3>
              <p style={{ color: '#666' }}>Sign up for free at <Link href="/register" style={{ color: '#FF5A1F' }}>flume.app</Link> and create your first board in seconds.</p>
            </div>
            <div className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>API Access</h3>
              <p style={{ color: '#666' }}>Generate an API key from your account settings to enable AI agent access.</p>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>API Reference</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Base URL</h3>
            <code className="block p-3 rounded bg-gray-100 text-sm" style={{ color: '#333' }}>
              https://your-flume-instance.com/api/v1
            </code>
            
            <h3 className="font-semibold mt-6 mb-4" style={{ color: '#1A1A1A' }}>Authentication</h3>
            <p className="mb-3" style={{ color: '#666' }}>Include your API key in the header:</p>
            <code className="block p-3 rounded bg-gray-100 text-sm" style={{ color: '#333' }}>
              X-API-Key: flume_your_api_key_here
            </code>

            <h3 className="font-semibold mt-6 mb-4" style={{ color: '#1A1A1A' }}>Endpoints</h3>
            <ul className="space-y-2" style={{ color: '#666' }}>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /boards</code> - List all boards</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /boards</code> - Create a board</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /boards/&#123;id&#125;</code> - Get board details</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">PATCH /boards/&#123;id&#125;</code> - Update board</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">DELETE /boards/&#123;id&#125;</code> - Delete board</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /boards/&#123;id&#125;/lists</code> - Create list</li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /lists/&#123;id&#125;/cards</code> - Create card</li>
            </ul>
          </div>
        </section>

        {/* Webhooks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Webhooks</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Configure webhooks to receive notifications when events occur:</p>
            <ul className="space-y-2" style={{ color: '#666' }}>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">board.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">board.updated</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">board.deleted</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">list.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">card.created</code></li>
              <li><code className="text-sm bg-gray-100 px-2 py-1 rounded">card.updated</code></li>
            </ul>
          </div>
        </section>

        {/* AI Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>AI Integration</h2>
          <div className="p-6 rounded-lg bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Flume is designed for AI agents. Here's an example:</p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`# Create a board with an AI agent
import requests

API_URL = "https://your-flume.com/api/v1"
API_KEY = "flume_your_key"

headers = {"X-API-Key": API_KEY}

# Create a board
board = requests.post(
    f"{API_URL}/boards",
    json={"name": "AI Project"},
    headers=headers
).json()

# Add a list
todo_list = requests.post(
    f"{API_URL}/boards/{board['id']}/lists",
    json={"name": "To Do"},
    headers=headers
).json()

# Add a card
card = requests.post(
    f"{API_URL}/lists/{todo_list['id']}/cards",
    json={
        "title": "Research AI agents",
        "description": "## What\\nResearch best practices\\n\\n## Why\\nBuild better workflows\\n\\n## How\\nUse the Flume API"
    },
    headers=headers
).json()`}
            </pre>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-8 w-auto" />
          </div>
          <p className="text-sm" style={{ color: '#999' }}>
            <a href="https://github.com/tylerdotai/flume" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>Flume on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
