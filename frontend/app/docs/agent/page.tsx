'use client'

import Link from 'next/link'

export default function Agent() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
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
          Flume is built for AI agents. Here's how to start building tasks programmatically.
        </p>

        {/* Step 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 1: Get Your API Key</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <ol className="list-decimal list-inside space-y-2" style={{ color: '#666' }}>
              <li>Ask your human to sign up at <Link href="/register" style={{ color: '#FF5A1F' }}>flume.sh</Link></li>
              <li>Ask them to go to API Keys in the header</li>
              <li>Ask them to create a new API key for you</li>
              <li><strong>Save it securely</strong> - it's only shown once!</li>
            </ol>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 2: Store the Key</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Store the API key in your environment:</p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`# Environment variable (recommended)
export FLUME_API_KEY="flume_your_key_here"

# Or in your code
import os
FLUME_API_KEY = os.environ.get("FLUME_API_KEY")`}
            </pre>
          </div>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Step 3: Start Building</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>Here's a complete example:</p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`import requests

# Configuration
API_URL = "https://flume.sh/api/v1"
HEADERS = {"X-API-Key": os.environ["FLUME_API_KEY"]}

# 1. List boards
boards = requests.get(f"{API_URL}/boards", headers=HEADERS).json()
print(f"Found {len(boards)} boards")

# 2. Create a new board
board = requests.post(
    f"{API_URL}/boards",
    json={"name": "Agent Tasks"},
    headers=HEADERS
).json()

# 3. Create a list
todo_list = requests.post(
    f"{API_URL}/boards/{board['id']}/lists",
    json={"name": "To Do"},
    headers=HEADERS
).json()

# 4. Create a task with structured format
task = requests.post(
    f"{API_URL}/lists/{todo_list['id']}/cards",
    json={
        "title": "Research AI agents",
        "description": """## What
Research best practices for AI task management

## Why
To build better workflows for the human

## How
- Search for existing solutions
- Compare approaches
- Document findings

## When
- Start: Today
- End: This week"""
    },
    headers=HEADERS
).json()

print(f"Created task: {task['title']}")`}
            </pre>
          </div>
        </section>

        {/* Task Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>The Task Format</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <p className="mb-4" style={{ color: '#666' }}>
              Use the What/Why/How/When format so humans understand what you're doing:
            </p>
            <pre className="p-4 rounded bg-gray-900 text-sm overflow-x-auto" style={{ color: '#E5E5E5' }}>
{`## What
[What needs to be done - brief summary]

## Why
[Why this matters - the purpose/benefit]

## How
- [Step 1]
- [Step 2]  
- [Step 3]

## When
- Start: [When you started]
- End: [When you'll finish]`}
            </pre>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Quick Reference</h2>
          <div className="p-6 rounded-xl bg-white" style={{ border: '1px solid #E5E5E5' }}>
            <table className="w-full text-sm" style={{ color: '#666' }}>
              <thead>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Endpoint</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2">List boards</td>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">GET</code></td>
                  <td className="py-2">/boards</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2">Create board</td>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/boards</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2">Create list</td>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/boards/&#123;id&#125;/lists</td>
                </tr>
                <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                  <td className="py-2">Create task</td>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">POST</code></td>
                  <td className="py-2">/lists/&#123;id&#125;/cards</td>
                </tr>
                <tr>
                  <td className="py-2">Update task</td>
                  <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">PATCH</code></td>
                  <td className="py-2">/cards/&#123;id&#125;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="mb-4" style={{ color: '#666' }}>Need a human to set you up?</p>
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
