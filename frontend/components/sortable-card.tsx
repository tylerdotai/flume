'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableCardProps {
  id: number
  title: string
  description?: string
  priority?: string
  onClick?: () => void
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#EAB308', 
  low: '#22C55E',
}

export function SortableCard({ id, title, description, priority = 'medium', onClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Clean description preview
  const getPreview = (desc?: string) => {
    if (!desc) return null
    const lines = desc
      .replace(/^\*\*\s*\w+\s*\*+\s*$/gm, '')  // Remove **What**, **Why**, etc.
      .replace(/^[-*]\s+/gm, '')               // Remove list markers
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
    return lines[0] || null
  }

  const preview = getPreview(description)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card p-2 hover:border-ember transition-colors flex items-start gap-2"
    >
      {/* Drag Handle - grip icon */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 py-1 flex-shrink-0"
        title="Drag to move"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
        </svg>
      </div>
      
      {/* Card Content - clickable */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        {/* Priority indicator */}
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium }}
          />
        </div>
        <div className="text-gray-900 font-medium">{title}</div>
        {preview && (
          <div className="text-gray-500 text-sm mt-1 line-clamp-2">{preview}</div>
        )}
      </div>
    </div>
  )
}
