'use client'

import Link from 'next/link'

export default function Agent() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-14 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/product" className="text-sm font-medium" style={{ color: '#666' }}>Product</Link>
          <Link href="/docs" className="text-sm font-medium" style={{ color: '#666' }}>Docs</Link>
          <Link href="/docs/agent" className="text-sm font-medium" style={{ color: '#FF5A1F' }}>Agent</Link>
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#1A1A1A' }}>Agent Setup Guide</h1>
        
        <p className="text-xl mb-8" style={{ color: '#666' }}>
          Flume is designed for AI agents. This guide shows how to connect your agent to Flume.
        </p>

        {/* Step 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 1: Get Your API Key</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <ol className="list-decimal list-inside space-y-2" style={{ color: '#666' }}>
              <li>Sign up at <Link href="/register" style={{ color: '#FF5A1F' }}>flume.app</Link></li>
              <li>Log in to your account</li>
              <li>Go to API Keys in the header</li>
              <li>Click "Add API Key" and give it a name</li>
              <li><strong>Save the key</strong> - it's only shown once!</li>
            </ol>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 2: Connect Your Agent</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Add your API key to your agent's environment:</p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`# Environment variable
export FLUME_API_KEY="flume_your_key_here"

# Or in your agent code
import os
FLUME_API_KEY = os.getenv("FLUME_API_KEY")`}
            </pre>
          </div>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 3: Use the API</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Example: Create a board and add tasks</p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`import requests

API_URL = "https://your-flume-backend.com/api/v1"
HEADERS = {"X-API-Key": FLUME_API_KEY}

# Create a board
board = requests.post(
    f"{API_URL}/boards",
    json={"name": "Agent Tasks"},
    headers=HEADERS
).json()

# Add a list
todo_list    f"{API = requests.post(
_URL}/boards/{board['id']}/lists",
    json={"name": "To Do"},
    headers=HEADERS
).json()

# Add a task with AI context
task = requests.post(
    f"{API_URL}/lists/{todo_list['id']}/cards",
    json={
        "title": "Research AI agents",
        "description": "## What\\\\nResearch best practices\\\\n\\\\n## Why\\\\nBuild better workflows\\\\n\\\\n## How\\\\nUse the Flume API\\\\n\\\\n## When\\\\n- Start: Today\\\\n- End: This week"
    },
    headers=HEADERS
).json()`}
            </pre>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>API Reference</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
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

        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            href="/register" 
            className="inline-block px-8 py-4 rounded-lg text-lg font-semibold text-white"
            style={{ background: '#FF5A1F' }}
          >
            Get Started
          </Link>
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
