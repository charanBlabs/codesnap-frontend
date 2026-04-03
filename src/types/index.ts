export interface Snippet {
  id: string
  title: string
  description?: string
  code: string
  language: string
  tags: string[]
  working_pages?: string
  created_by?: string
  created_by_name?: string
  updated_by?: string
  updated_by_name?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  created_at: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export const LANGUAGES = [
  { value: 'php', label: 'PHP', color: '#8b5cf6' },
  { value: 'javascript', label: 'JavaScript', color: '#f59e0b' },
  { value: 'css', label: 'CSS', color: '#3b82f6' },
  { value: 'html', label: 'HTML', color: '#f97316' },
  { value: 'sql', label: 'SQL', color: '#10b981' },
  { value: 'typescript', label: 'TypeScript', color: '#06b6d4' },
  { value: 'python', label: 'Python', color: '#84cc16' },
  { value: 'bash', label: 'Bash', color: '#ec4899' },
  { value: 'json', label: 'JSON', color: '#a3a3a3' },
]
