'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getLists, getCards, createCard, createList, updateCard, deleteCard, deleteList, getComments, createComment, getBoard } from '@/lib/api'
import { useSocket } from '@/lib/useSocket'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableCard } from '@/components/sortable-card'
import ReactMarkdown from 'react-markdown'
import DOMPurify from 'dompurify'

interface List { id: number; name: string; position: number }
interface Card { id: number; title: string; description?: string; position: number; list_id: number; labels?: string; assignee_id?: number; due_date?: string; priority?: string }
interface Comment { id: number; content: string; author_id: number; created_at: string }

const LABEL_COLORS = [
  { name: 'Red', color: '#EF4444' }, { name: 'Orange', color: '#F97316' }, { name: 'Yellow', color: '#EAB308' },
  { name: 'Green', color: '#22C55E' }, { name: 'Blue', color: '#3B82F6' }, { name: 'Purple', color: '#A855F7' }, { name: 'Pink', color: '#EC4899' },
]

const PRIORITIES = [
  { name: 'High', color: '#EF4444', value: 'high' },
  { name: 'Medium', color: '#EAB308', value: 'medium' },
  { name: 'Low', color: '#22C55E', value: 'low' },
]

const TASK_TEMPLATE = `## What
-

## Why
-

## How
- 

## When
- Start: 
- End:
`

export default function BoardDetailPage() {
  const { user, token, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const boardId = Number(params.id)

  const [board, setBoard] = useState<any>(null)
  const [lists, setLists] = useState<List[]>([])
  const [cards, setCards] = useState<Record<number, Card[]>>({})
  const [showAddList, setShowAddList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [showAddCard, setShowAddCard] = useState<number | null>(null)
  const [newCardName, setNewCardName] = useState('')
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  
  // Sidebar states
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editLabels, setEditLabels] = useState<string[]>([])
  const [editAssignee, setEditAssignee] = useState<number | null>(null)
  const [editPriority, setEditPriority] = useState('medium')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  // Socket.IO real-time updates
  const handleCardCreated = useCallback((card: Card) => {
    setCards(prev => {
      const listCards = prev[card.list_id] || []
      if (listCards.find(c => c.id === card.id)) return prev
      return { ...prev, [card.list_id]: [...listCards, card] }
    })
  }, [])

  const handleCardUpdated = useCallback((card: Card) => {
    setCards(prev => {
      const newState = { ...prev }
      for (const listId in newState) {
        newState[listId] = newState[listId].map(c => c.id === card.id ? card : c)
      }
      return newState
    })
  }, [])

  const handleCardDeleted = useCallback((cardId: number) => {
    setCards(prev => {
      const newState = { ...prev }
      for (const listId in newState) {
        newState[listId] = newState[listId].filter(c => c.id !== cardId)
      }
      return newState
    })
  }, [])

  const { connected } = useSocket({
    boardId,
    onCardCreated: handleCardCreated,
    onCardUpdated: handleCardUpdated,
    onCardDeleted: handleCardDeleted,
  })

  useEffect(() => { if (!authLoading && !token) router.push('/login') }, [authLoading, token, router])
  useEffect(() => { if (token && boardId) { loadBoard(); loadLists(); } }, [token, boardId])

  const loadBoard = async () => {
    if (!token) return
    try {
      const data = await getBoard(token, boardId)
      setBoard(data)
    } catch (err) { console.error(err) }
  }

  const loadLists = async () => {
    if (!token) return
    try {
      const data = await getLists(token, boardId)
      setLists(data)
      data.forEach((list: List) => loadCards(list.id))
    } catch (err) { console.error(err) }
  }

  const loadCards = async (listId: number) => {
    if (!token) return
    try {
      const data = await getCards(token, listId)
      setCards(prev => ({ ...prev, [listId]: data }))
    } catch (err) { console.error(err) }
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newListName.trim()) return
    try {
      const list = await createList(token, boardId, { name: newListName.trim() })
      setLists([...lists, list])
      setNewListName('')
      setShowAddList(false)
    } catch (err) { console.error(err) }
  }

  const handleDeleteList = async (listId: number) => {
    if (!token || !confirm('Delete this list and all its cards?')) return
    try {
      await deleteList(token, listId)
      setLists(lists.filter(l => l.id !== listId))
      setCards(prev => {
        const newState = { ...prev }
        delete newState[listId]
        return newState
      })
    } catch (err: any) { 
      console.error('Delete list failed:', err)
      alert(err?.message || 'Failed to delete list')
    }
  }

  const handleCreateCard = async (listId: number, e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newCardName.trim()) return
    try {
      const card = await createCard(token, listId, { title: newCardName.trim(), description: TASK_TEMPLATE, priority: 'medium' })
      setCards(prev => ({ ...prev, [listId]: [...(prev[listId] || []), card] }))
      setNewCardName('')
      setShowAddCard(null)
    } catch (err) { console.error(err) }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    for (const listId in cards) {
      const found = cards[listId].find(c => c.id === active.id)
      if (found) { setActiveCard(found); break }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    
    if (!over || !token) return
    
    const activeId = active.id as number
    const overId = over.id as number
    
    // If dropped on same position, do nothing
    if (activeId === overId) return
    
    // Find source list and card
    let sourceListId: number | null = null
    let sourceIndex = -1
    
    for (const listId of lists) {
      const cardList = cards[listId.id] || []
      const idx = cardList.findIndex(c => c.id === activeId)
      if (idx !== -1) {
        sourceListId = listId.id
        sourceIndex = idx
        break
      }
    }
    
    if (!sourceListId) return
    
    // Find target list and position
    let targetListId: number | null = null
    let targetIndex = -1
    
    // Check if dropped on a list container
    const overList = lists.find(l => l.id === overId)
    if (overList) {
      targetListId = overList.id
      targetIndex = (cards[targetListId] || []).length
    } else {
      // Dropped on a card - find which list and position
      for (const listId of lists) {
        const cardList = cards[listId.id] || []
        const idx = cardList.findIndex(c => c.id === overId)
        if (idx !== -1) {
          targetListId = listId.id
          targetIndex = idx
          break
        }
      }
    }
    
    if (!targetListId) return
    
    // Get the card being moved
    const cardToMove = cards[sourceListId]?.find(c => c.id === activeId)
    if (!cardToMove) return
    
    // If moving within same list (reordering)
    if (sourceListId === targetListId) {
      const currentList = [...(cards[sourceListId] || [])]
      currentList.splice(sourceIndex, 1)
      currentList.splice(targetIndex, 0, cardToMove)
      
      // Update positions
      setCards(prev => ({
        ...prev,
        [sourceListId]: currentList
      }))
      
      // Optionally save new order to backend
      // await updateCardOrder(token, sourceListId, currentList.map(c => c.id))
      return
    }
    
    // Moving to different list
    try {
      await updateCard(token, activeId, { 
        list_id: targetListId,
        position: targetIndex 
      })
      
      // Optimistic update
      setCards(prev => {
        const newState = { ...prev }
        // Remove from source
        newState[sourceListId] = (newState[sourceListId] || []).filter(c => c.id !== activeId)
        // Add to target at position
        const targetList = [...(newState[targetListId] || [])]
        targetList.splice(targetIndex, 0, { ...cardToMove, list_id: targetListId })
        newState[targetListId] = targetList
        return newState
      })
    } catch (err) {
      console.error('Drag failed:', err)
      // Reload on error
      if (token && boardId) loadLists()
    }
  }

  // Card detail functions
  const openCardDetail = async (card: Card) => {
    setSelectedCard(card)
    setEditTitle(card.title)
    setEditDescription(card.description || TASK_TEMPLATE)
    setEditDueDate(card.due_date ? card.due_date.split('T')[0] : '')
    setEditLabels(card.labels ? JSON.parse(card.labels) : [])
    setEditAssignee(card.assignee_id || null)
    setEditPriority(card.priority || 'medium')
    setSidebarOpen(true)
    // Load comments
    try {
      const data = await getComments(token!, card.id)
      setComments(data)
    } catch (err) { console.error(err) }
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedCard(null)
  }

  const saveCardDetail = async () => {
    if (!token || !selectedCard) return
    try {
      await updateCard(token, selectedCard.id, { 
        title: editTitle, 
        description: editDescription, 
        due_date: editDueDate || null, 
        labels: JSON.stringify(editLabels), 
        assignee_id: editAssignee,
        priority: editPriority 
      })
      loadLists()
      closeSidebar()
    } catch (err) { console.error(err) }
  }

  const handleDeleteCard = async () => {
    if (!token || !selectedCard || !confirm('Delete this card?')) return
    try {
      await deleteCard(token, selectedCard.id)
      setCards(prev => { 
        const newState = { ...prev }
        newState[selectedCard.list_id] = newState[selectedCard.list_id].filter(c => c.id !== selectedCard.id)
        return newState 
      })
      closeSidebar()
    } catch (err) { console.error(err) }
  }

  const toggleLabel = (color: string) => setEditLabels(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])

  const handleAddComment = async () => {
    if (!token || !selectedCard || !newComment.trim()) return
    try {
      const comment = await createComment(token, selectedCard.id, newComment.trim())
      setComments([...comments, comment])
      setNewComment('')
    } catch (err) { console.error(err) }
  }

  const getPriorityColor = (p: string) => PRIORITIES.find(x => x.value === p)?.color || '#EAB308'

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-accent">Loading...</div></div>

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen p-4 sm:p-6 overflow-x-auto flex flex-col">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/board" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: '#FF5A1F' }}></div>
            </Link>
            <button onClick={() => router.push('/board')} className="text-gray-400 hover:text-gray-800 text-sm">← Boards</button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{board?.name || 'Board'}</h1>
            <span className={`text-xs px-2 py-1 rounded ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {connected ? '● Live' : '○ Offline'}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/webhooks" className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">Webhooks</Link>
            <Link href="/api-keys" className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">API Keys</Link>
            <button onClick={logout} className="btn-ghost flex-1 sm:flex-none text-center py-2 px-3 sm:px-4 text-sm">Sign out</button>
          </div>
        </header>
        
        <div className="flex gap-4 items-start">
          {lists.map((list) => (
            <div key={list.id} className="flex-shrink-0 w-72">
              <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{list.name}</h3>
                  <button onClick={() => handleDeleteList(list.id)} className="text-gray-400 hover:text-red-500 text-sm">Delete</button>
                </div>
                <span className="text-gray-500 text-sm">{cards[list.id]?.length || 0}</span>
              </div>
              <SortableContext items={(cards[list.id] || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 mb-2 max-h-[60vh] overflow-y-auto">
                  {cards[list.id]?.map((card) => (
                    <div key={card.id} onClick={() => openCardDetail(card)}>
                      <SortableCard 
                        id={card.id} 
                        title={card.title} 
                        description={card.description}
                        priority={card.priority}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
              {showAddCard === list.id ? (
                <form onSubmit={(e) => handleCreateCard(list.id, e)} className="p-2">
                  <input 
                    type="text" 
                    value={newCardName} 
                    onChange={(e) => setNewCardName(e.target.value)} 
                    placeholder="Card title" 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-ember focus:outline-none" 
                    autoFocus 
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="btn-ember py-1 px-3 text-sm">Add</button>
                    <button type="button" onClick={() => setShowAddCard(null)} className="btn-ghost py-1 px-3 text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowAddCard(list.id)} className="w-full p-2 text-left text-gray-500 hover:text-accent text-sm">
                  + Add card
                </button>
              )}
            </div>
          ))}
          {showAddList ? (
            <div className="flex-shrink-0 w-72">
              <form onSubmit={handleCreateList} className="card p-4">
                <input 
                  type="text" 
                  value={newListName} 
                  onChange={(e) => setNewListName(e.target.value)} 
                  placeholder="List name" 
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:border-ember focus:outline-none mb-2" 
                  autoFocus 
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-ember py-1 px-3 text-sm">Add</button>
                  <button type="button" onClick={() => setShowAddList(false)} className="btn-ghost py-1 px-3 text-sm">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => setShowAddList(true)} className="flex-shrink-0 w-72 p-4 card border-dashed text-gray-400 hover:text-accent text-center">
              + Add list
            </button>
          )}
        </div>
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="card p-3 bg-gray-50 border-ember">
            <div className="text-gray-800">{activeCard.title}</div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Sidebar */}
      {sidebarOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar}></div>
          
          {/* Sidebar panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="text-lg sm:text-xl font-bold bg-white text-gray-900 border-b border-gray-200 focus:border-ember focus:outline-none flex-1 mr-2 px-1" 
                />
                <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>
              
              {/* Priority */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setEditPriority(p.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        editPriority === p.value 
                          ? 'text-black' 
                          : 'bg-gray-50 text-gray-300 hover:bg-gray-700'
                      }`}
                      style={{ 
                        backgroundColor: editPriority === p.value ? p.color : undefined 
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Description with Markdown */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-400">Description</label>
                  <button 
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="text-xs text-accent hover:text-accent-light"
                  >
                    {showMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {showMarkdownPreview ? (
                  <div className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg text-gray-800">
                    <ReactMarkdown>{DOMPurify.sanitize(editDescription)}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                    rows={12} 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-ember focus:outline-none font-mono"
                    placeholder="## What&#10;-&#10;&#10;## Why&#10;-&#10;&#10;## How&#10;- &#10;&#10;## When&#10;- Start:&#10;- End:"
                  />
                )}
              </div>
              
              {/* Due Date */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={editDueDate} 
                  onChange={(e) => setEditDueDate(e.target.value)} 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-ember focus:outline-none" 
                />
              </div>
              
              {/* Labels */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Labels</label>
                <div className="flex gap-2 flex-wrap">
                  {LABEL_COLORS.map(label => (
                    <button
                      key={label.color}
                      type="button"
                      onClick={() => toggleLabel(label.color)}
                      className={`w-8 h-8 rounded-full transition-transform ${editLabels.includes(label.color) ? 'scale-110 ring-2 ring-white' : 'opacity-50 hover:opacity-100'}`}
                      style={{ backgroundColor: label.color }}
                      title={label.name}
                    />
                  ))}
                </div>
              </div>

              {/* Assignee */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Assignee</label>
                <select 
                  value={editAssignee || ''} 
                  onChange={(e) => setEditAssignee(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-ember focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  <option value={user?.id}>{user?.username}</option>
                </select>
              </div>

              {/* Comments Section */}
              <div className="mb-4 border-t border-gray-200 pt-4">
                <label className="block text-sm text-gray-400 mb-2">Comments</label>
                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                  {comments.map(comment => (
                    <div key={comment.id} className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                      {comment.content}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Add a comment..." 
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-ember focus:outline-none" 
                  />
                  <button onClick={handleAddComment} className="btn-ember py-1 px-3 text-sm">Post</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button onClick={handleDeleteCard} className="text-red-400 hover:text-red-300 text-sm">Delete card</button>
                <div className="flex gap-2">
                  <button onClick={closeSidebar} className="btn-ghost">Cancel</button>
                  <button onClick={saveCardDetail} className="btn-ember">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  )
}
