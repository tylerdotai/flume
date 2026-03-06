'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableCardProps {
  id: number
  title: string
  description?: string
}

export function SortableCard({ id, title, description }: SortableCardProps) {
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
      <div className="text-cream font-medium">{title}</div>
      {description && (
        <div className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</div>
      )}
    </div>
  )
}
