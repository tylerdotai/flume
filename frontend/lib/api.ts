// Smart API URL detection
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined') {
    // In browser: use same host, port 8000
    return window.location.origin.replace(':3000', ':8000').replace(':3001', ':8000')
  }
  return 'http://localhost:8000'
}
const API_URL = getApiUrl()

interface FetchOptions extends RequestInit {
  token?: string
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

// Auth
export const login = (email: string, password: string) =>
  fetchApi<{ access_token: string }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const register = (email: string, username: string, password: string) =>
  fetchApi<any>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  })

export const getMe = (token: string) =>
  fetchApi<any>('/api/v1/auth/me', { token })

// Boards
export const getBoards = (token: string) =>
  fetchApi<any[]>('/api/v1/boards', { token })

export const createBoard = (token: string, data: { name: string; description?: string; color?: string }) =>
  fetchApi<any>('/api/v1/boards', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })

export const updateBoard = (token: string, id: number, data: any) =>
  fetchApi<any>(`/api/v1/boards/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })

export const deleteBoard = (token: string, id: number) =>
  fetchApi<any>(`/api/v1/boards/${id}`, {
    method: 'DELETE',
    token,
  })

// Lists
export const getLists = (token: string, boardId: number) =>
  fetchApi<any[]>(`/api/v1/boards/${boardId}/lists`, { token })

export const createList = (token: string, boardId: number, data: { name: string; position?: number }) =>
  fetchApi<any>(`/api/v1/boards/${boardId}/lists`, {
    method: 'POST',
    token,
    body: JSON.stringify({ ...data, board_id: boardId }),
  })

// Cards
export const getCards = (token: string, listId: number) =>
  fetchApi<any[]>(`/api/v1/lists/${listId}/cards`, { token })

export const createCard = (token: string, listId: number, data: { title: string; description?: string; priority?: string }) =>
  fetchApi<any>(`/api/v1/lists/${listId}/cards`, {
    method: 'POST',
    token,
    body: JSON.stringify({ ...data, list_id: listId }),
  })

export const updateCard = (token: string, id: number, data: any) =>
  fetchApi<any>(`/api/v1/cards/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })

export const deleteCard = (token: string, id: number) =>
  fetchApi<any>(`/api/v1/cards/${id}`, {
    method: 'DELETE',
    token,
  })

// Comments
export const getComments = (token: string, cardId: number) =>
  fetchApi<any[]>(`/api/v1/cards/${cardId}/comments`, { token })

export const createComment = (token: string, cardId: number, content: string) =>
  fetchApi<any>(`/api/v1/cards/${cardId}/comments`, {
    method: 'POST',
    token,
    body: JSON.stringify({ content, card_id: cardId }),
  })

export const deleteComment = (token: string, commentId: number) =>
  fetchApi<any>(`/api/v1/comments/${commentId}`, {
    method: 'DELETE',
    token,
  })

export const deleteList = (token: string, listId: number) =>
  fetchApi<void>(`/api/v1/lists/${listId}`, {
    method: 'DELETE',
    token,
  })
