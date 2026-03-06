import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

// Smart Socket URL detection
const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(':3000', ':8000').replace(':3001', ':8000').replace('http', 'ws')
  }
  return 'ws://localhost:8000'
}

interface UseSocketOptions {
  boardId?: number
  onCardCreated?: (card: any) => void
  onCardUpdated?: (card: any) => void
  onCardDeleted?: (cardId: number) => void
  onListCreated?: (list: any) => void
  onListUpdated?: (list: any) => void
  onListDeleted?: (listId: number) => void
  onCommentCreated?: (comment: any) => void
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)

  const {
    boardId,
    onCardCreated,
    onCardUpdated,
    onCardDeleted,
    onListCreated,
    onListUpdated,
    onListDeleted,
    onCommentCreated,
  } = options

  useEffect(() => {
    const socketUrl = getSocketUrl()
    
    // Connect to Socket.IO with reconnection settings
    socketRef.current = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socketRef.current.on('connect', () => {
      setConnected(true)
      setReconnecting(false)
      console.log('Socket connected')
      
      // Join board room if boardId provided
      if (boardId) {
        socketRef.current?.emit('join_board', { board_id: boardId })
      }
    })

    socketRef.current.on('disconnect', () => {
      setConnected(false)
      console.log('Socket disconnected')
    })

    socketRef.current.on('reconnect_attempt', (attemptNumber: number) => {
      setReconnecting(true)
      console.log(`Socket reconnect attempt ${attemptNumber}`)
    })

    socketRef.current.on('reconnect', (attemptNumber: number) => {
      setConnected(true)
      setReconnecting(false)
      console.log(`Socket reconnected after ${attemptNumber} attempts`)
      
      // Re-join board room after reconnection
      if (boardId) {
        socketRef.current?.emit('join_board', { board_id: boardId })
      }
    })

    socketRef.current.on('reconnect_failed', () => {
      setReconnecting(false)
      console.log('Socket reconnection failed')
    })

    // Set up event listeners
    if (onCardCreated) {
      socketRef.current.on('card.created', onCardCreated)
    }
    if (onCardUpdated) {
      socketRef.current.on('card.updated', onCardUpdated)
    }
    if (onCardDeleted) {
      socketRef.current.on('card.deleted', (data: { id: number }) => onCardDeleted(data.id))
    }
    if (onListCreated) {
      socketRef.current.on('list.created', onListCreated)
    }
    if (onListUpdated) {
      socketRef.current.on('list.updated', onListUpdated)
    }
    if (onListDeleted) {
      socketRef.current.on('list.deleted', (data: { id: number }) => onListDeleted(data.id))
    }
    if (onCommentCreated) {
      socketRef.current.on('comment.created', onCommentCreated)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [
    boardId,
    onCardCreated,
    onCardUpdated,
    onCardDeleted,
    onListCreated,
    onListUpdated,
    onListDeleted,
    onCommentCreated,
  ])

  const joinBoard = useCallback((id: number) => {
    socketRef.current?.emit('join_board', { board_id: id })
  }, [])

  const leaveBoard = useCallback((id: number) => {
    socketRef.current?.emit('leave_board', { board_id: id })
  }, [])

  return {
    socket: socketRef.current,
    connected,
    reconnecting,
    joinBoard,
    leaveBoard,
  }
}
