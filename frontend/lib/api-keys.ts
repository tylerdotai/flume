import { fetchApi } from './api'

export const createApiKey = (token: string, name: string) =>
  fetchApi<any>('/api/v1/ai/keys', {
    method: 'POST',
    token,
    body: JSON.stringify({ name }),
  })

export const listApiKeys = (token: string) =>
  fetchApi<any[]>('/api/v1/ai/keys', { token })

export const deleteApiKey = (token: string, keyId: number) =>
  fetchApi<void>(`/api/v1/ai/keys/${keyId}`, {
    method: 'DELETE',
    token,
  })
