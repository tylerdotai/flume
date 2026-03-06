import { fetchApi } from './api'

export const getWebhooks = (token: string) =>
  fetchApi<any[]>('/api/v1/webhooks', { token })

export const createWebhook = (token: string, data: { url: string; events: string[]; secret?: string }) =>
  fetchApi<any>('/api/v1/webhooks', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })

export const deleteWebhook = (token: string, webhookId: number) =>
  fetchApi<void>(`/api/v1/webhooks/${webhookId}`, {
    method: 'DELETE',
    token,
  })

export const testWebhook = (token: string, webhookId: number) =>
  fetchApi<{ success: boolean }>(`/api/v1/webhooks/${webhookId}/test`, {
    method: 'POST',
    token,
  })
