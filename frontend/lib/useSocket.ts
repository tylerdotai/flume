import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'http://localhost:8000'

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
    // Connect to Socket.IO
    socketRef.current = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
    })

    socketRef.current.on('connect', () => {
      setConnected(true)
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
    joinBoard,
    leaveBoard,
  }
}
