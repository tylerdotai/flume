'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getBoards, createBoard, deleteBoard } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Board {
  id: number
  name: string
  description?: string
  color: string
}

const BOARD_COLORS = [
  '#FF6B35', // Ember (default)
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6B7280', // Gray
]

export default function BoardPage() {
  const { user, token, logout, loading } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [newBoardColor, setNewBoardColor] = useState(BOARD_COLORS[0])
  const router = useRouter()

  useEffect(() => {
    if (!loading && !token) router.push('/login')
  }, [loading, token, router])

  useEffect(() => {
    if (token) getBoards(token).then(setBoards).catch(console.error)
  }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newBoardName.trim()) {
      alert('Please enter a board name')
      return
    }
    try {
      const board = await createBoard(token, { name: newBoardName.trim(), color: newBoardColor })
      setBoards([...boards, board])
      setNewBoardName('')
      setNewBoardColor(BOARD_COLORS[0])
      setShowCreate(false)
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this board?')) return
    try {
      await deleteBoard(token, id)
      setBoards(boards.filter(b => b.id !== id))
    } catch (err: any) { 
      console.error('Delete failed:', err)
      alert(err?.message || 'Failed to delete board')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-accent">Loading...</div></div>

  return (
    <div className="min-h-screen p-8 flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/board" className="flex items-center gap-2">
            <img src="/flume-logo.jpg" alt="Flume" className="h-12 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link href="/webhooks" className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">Webhooks</Link>
          <Link href="/api-keys" className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">API Keys</Link>
          <button onClick={logout} className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">Sign out</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button onClick={() => setShowCreate(true)} className="card p-6 flex items-center justify-center min-h-[160px] border-dashed hover:border-ember">
          <div className="text-center">
            <div className="text-4xl text-accent mb-2">+</div>
            <div className="text-gray-400">Create new board</div>
          </div>
        </button>

        {boards.map((board) => (
          <div key={board.id} className="card p-6 relative group">
            <div className="absolute top-0 left-0 w-full h-2 rounded-t-xl" style={{ backgroundColor: board.color }} />
            <h3 className="text-lg font-semibold text-gray-800 mt-2">{board.name}</h3>
            <div className="flex gap-2 mt-4">
              <Link href={`/board/${board.id}`} className="btn-ember flex-1 text-center py-2">Open</Link>
              <button onClick={() => handleDelete(board.id)} className="btn-ghost px-3 py-2 text-red-400">×</button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Board</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:border-ember focus:outline-none mb-4"
                autoFocus
              />
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Board Color</label>
                <div className="flex gap-2 flex-wrap">
                  {BOARD_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewBoardColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${newBoardColor === color ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-ember flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t mt-auto pt-8 pb-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-auto" style={{ background: '#FF5A1F' }}></div>
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
