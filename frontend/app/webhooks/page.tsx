'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getWebhooks, createWebhook, deleteWebhook, testWebhook } from '@/lib/webhooks'
import { useRouter } from 'next/navigation'

const WEBHOOK_EVENTS = [
  'board.created', 'board.updated', 'board.deleted',
  'list.created', 'list.updated', 'list.deleted',
  'card.created', 'card.updated', 'card.deleted', 'card.moved',
  'comment.created', 'comment.updated', 'comment.deleted',
]

export default function WebhooksPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !token) router.push('/login')
  }, [authLoading, token, router])

  useEffect(() => {
    if (token) loadWebhooks()
  }, [token])

  const loadWebhooks = async () => {
    if (!token) return
    try {
      const data = await getWebhooks(token)
      setWebhooks(data)
    } catch (err) { console.error(err) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !url || !selectedEvents.length) return
    setSaving(true)
    try {
      await createWebhook(token, { url, events: selectedEvents, secret: secret || undefined })
      setShowForm(false)
      setUrl('')
      setSecret('')
      setSelectedEvents([])
      loadWebhooks()
    } catch (err: any) {
      alert(err.message || 'Failed to create webhook')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this webhook?')) return
    try {
      await deleteWebhook(token, id)
      loadWebhooks()
    } catch (err: any) {
      alert(err.message || 'Failed to delete webhook')
    }
  }

  const handleTest = async (id: number) => {
    if (!token) return
    setTesting(id)
    try {
      const result = await testWebhook(token, id)
      alert(result.success ? 'Webhook test successful!' : 'Webhook test failed')
    } catch (err: any) {
      alert(err.message || 'Failed to test webhook')
    } finally {
      setTesting(null)
    }
  }

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    )
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-ember">Loading...</div></div>

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/board')} className="text-gray-400 hover:text-cream">← Back</button>
          <h1 className="text-2xl font-bold text-cream">Webhooks</h1>
        </div>

        <p className="text-gray-400 mb-6">
          Webhooks let external services know when events happen in Flume. 
          Configure URLs to receive HTTP POST requests.
        </p>

        {/* Webhook List */}
        <div className="space-y-3 mb-6">
          {webhooks.map(webhook => (
            <div key={webhook.id} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-cream font-medium truncate flex-1">{webhook.url}</div>
                <div className="flex gap-2 ml-2">
                  <button 
                    onClick={() => handleTest(webhook.id)}
                    disabled={testing === webhook.id}
                    className="btn-ghost py-1 px-2 text-xs"
                  >
                    {testing === webhook.id ? 'Testing...' : 'Test'}
                  </button>
                  <button 
                    onClick={() => handleDelete(webhook.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {JSON.parse(webhook.events).map((e: string) => (
                  <span key={e} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
            </div>
          ))}
          {webhooks.length === 0 && (
            <div className="text-gray-500 text-center py-8">No webhooks configured</div>
          )}
        </div>

        {/* Add Form */}
        {showForm ? (
          <form onSubmit={handleCreate} className="card p-4 space-y-4">
            <h2 className="text-lg font-bold text-cream">New Webhook</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-server.com/webhook"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-cream text-sm focus:border-ember focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Secret (optional)</label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Webhook secret for verification"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-cream text-sm focus:border-ember focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Events</label>
              <div className="flex gap-2 flex-wrap">
                {WEBHOOK_EVENTS.map(event => (
                  <button
                    key={event}
                    type="button"
                    onClick={() => toggleEvent(event)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      selectedEvents.includes(event)
                        ? 'bg-ember text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving || !selectedEvents.length} className="btn-ember py-2 px-4 text-sm disabled:opacity-50">
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost py-2 px-4 text-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="btn-ember py-2 px-4">
            + Add Webhook
          </button>
        )}
      </div>
    </div>
  )
}
