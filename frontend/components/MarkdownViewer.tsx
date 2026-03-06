'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import DOMPurify from 'dompurify'

interface Props {
  content: string
}

export function MarkdownViewer({ content }: Props) {
  const sanitized = useMemo(() => {
    if (typeof window === 'undefined') return content
    return DOMPurify.sanitize(content)
  }, [content])

  return <ReactMarkdown>{sanitized}</ReactMarkdown>
}
