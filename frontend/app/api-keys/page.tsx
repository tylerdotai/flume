'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createApiKey, listApiKeys, deleteApiKey } from '@/lib/api-keys'
import { useRouter } from 'next/navigation'

export default function ApiKeysPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [keys, setKeys] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [newKey, setNewKey] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !token) router.push('/login')
  }, [authLoading, token, router])

  useEffect(() => {
    if (token) loadKeys()
  }, [token])

  const loadKeys = async () => {
    if (!token) return
    try {
      const data = await listApiKeys(token)
      setKeys(data)
    } catch (err) { console.error(err) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !keyName.trim()) return
    setSaving(true)
    try {
      const result = await createApiKey(token, keyName.trim())
      setNewKey(result.key)  // Store the key to show once
      setKeyName('')
      setShowForm(false)
      loadKeys()
    } catch (err: any) {
      alert(err.message || 'Failed to create key')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Revoke this API key?')) return
    try {
      await deleteApiKey(token, id)
      loadKeys()
    } catch (err: any) {
      alert(err.message || 'Failed to delete key')
    }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-accent">Loading...</div></div>

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/board')} className="text-gray-400 hover:text-gray-800">← Back</button>
          <h1 className="text-2xl font-bold text-gray-800">API Keys</h1>
        </div>

        <p className="text-gray-400 mb-6">
          API keys let AI agents access your boards. 
          The key is only shown once when created - save it immediately!
        </p>

        {/* New Key Display */}
        {newKey && (
          <div className="card p-4 mb-6 border-yellow-500/50 bg-yellow-500/10">
            <h3 className="text-yellow-400 font-bold mb-2">⚠️ Save this key now!</h3>
            <code className="block bg-white p-3 rounded text-gray-800 text-sm break-all">{newKey}</code>
            <button onClick={() => setNewKey('')} className="mt-2 text-gray-400 hover:text-gray-800 text-sm">
              I've saved it - hide this
            </button>
          </div>
        )}

        {/* Key List */}
        <div className="space-y-3 mb-6">
          {keys.map(key => (
            <div key={key.id} className="card p-4 flex justify-between items-center">
              <div>
                <div className="text-gray-800 font-medium">{key.name}</div>
                <div className="text-gray-500 text-sm">
                  Created: {new Date(key.created_at).toLocaleDateString()}
                  {!key.is_active && <span className="text-red-400 ml-2">(Revoked)</span>}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(key.id)}
                className="text-red-400 hover:text-red-300 text-sm"
                disabled={!key.is_active}
              >
                Revoke
              </button>
            </div>
          ))}
          {keys.length === 0 && (
            <div className="text-gray-500 text-center py-8">No API keys yet</div>
          )}
        </div>

        {/* Create Form */}
        {showForm ? (
          <form onSubmit={handleCreate} className="card p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">New API Key</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name (e.g., "AI Agent", "Claude")</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Agent name"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-ember focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-ember py-2 px-4 text-sm disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Key'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost py-2 px-4 text-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="btn-ember py-2 px-4">
            + Add API Key
          </button>
        )}
      </div>
    </div>
  )
}
