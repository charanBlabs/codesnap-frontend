import { Snippet, Tag, User } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// Auth
export async function loginApi(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password })
  const res = await fetch(`${API_URL}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Login failed')
  }
  return res.json() as Promise<{ access_token: string; token_type: string; user: User }>
}

// Snippets
export async function getSnippets(params: {
  search?: string
  tag?: string
  language?: string
  limit?: number
  offset?: number
}, token: string): Promise<Snippet[]> {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.tag) query.set('tag', params.tag)
  if (params.language) query.set('language', params.language)
  if (params.limit) query.set('limit', String(params.limit))
  if (params.offset) query.set('offset', String(params.offset))
  return fetchApi<Snippet[]>(`/api/snippets?${query}`, {}, token)
}

export async function getSnippet(id: string, token: string): Promise<Snippet> {
  return fetchApi<Snippet>(`/api/snippets/${id}`, {}, token)
}

export async function createSnippet(data: Partial<Snippet>, token: string): Promise<Snippet> {
  return fetchApi<Snippet>('/api/snippets', { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function updateSnippet(id: string, data: Partial<Snippet>, token: string): Promise<Snippet> {
  return fetchApi<Snippet>(`/api/snippets/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token)
}

export async function deleteSnippet(id: string, token: string): Promise<void> {
  return fetchApi(`/api/snippets/${id}`, { method: 'DELETE' }, token)
}

// Tags
export async function getTags(token: string): Promise<Tag[]> {
  return fetchApi<Tag[]>('/api/tags', {}, token)
}

export async function createTag(data: { name: string; color: string }, token: string): Promise<Tag> {
  return fetchApi<Tag>('/api/tags', { method: 'POST', body: JSON.stringify(data) }, token)
}

// Users
export async function getUsers(token: string): Promise<User[]> {
  return fetchApi<User[]>('/api/users', {}, token)
}

export async function createUser(data: { email: string; name: string; password: string; role: string }, token: string): Promise<User> {
  return fetchApi<User>('/api/users', { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function deleteUser(id: string, token: string): Promise<void> {
  return fetchApi(`/api/users/${id}`, { method: 'DELETE' }, token)
}
