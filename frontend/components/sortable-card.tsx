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
      {description && (
        <div className="text-gray-500 text-sm mt-1 line-clamp-2">{description.replace(/## What/g, '').replace(/## Why/g, '').substring(0, 50)}</div>
      )}
    </div>
  )
}
