'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableCardProps {
  id: number
  title: string
  description?: string
  priority?: string
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#EAB308', 
  low: '#22C55E',
}

export function SortableCard({ id, title, description, priority = 'medium' }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Clean description preview - remove markdown headers and show first meaningful line
  const getPreview = (desc?: string) => {
    if (!desc) return null
    // Remove ## headers and get first non-empty line
    const lines = desc
      .replace(/^##\s+\w+\s*$/gm, '')  // Remove ## What, ## Why, etc.
      .replace(/^\*\*.*?\*\*/gm, '')     // Remove **bold** markers
      .replace(/^[-*]\s+/gm, '')          // Remove list markers
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
      {...attributes}
      {...listeners}
      className="card p-3 cursor-grab active:cursor-grabbing hover:border-ember transition-colors"
    >
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
      {description && (
        <div className="text-xs text-gray-400 mt-2">Click to view details →</div>
      )}
    </div>
  )
}
