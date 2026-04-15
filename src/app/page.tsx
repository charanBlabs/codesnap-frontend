'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, SlidersHorizontal, Code2, Loader2, X } from 'lucide-react'
import { Snippet, Tag, LANGUAGES } from '@/types'
import { getSnippets, getTags, createSnippet, updateSnippet, deleteSnippet } from '@/lib/api'
import { SnippetCard } from '@/components/SnippetCard'
import { PublicSnippetCard } from '@/components/PublicSnippetCard'
import { SnippetModal } from '@/components/SnippetModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Navbar } from '@/components/Navbar'
import { PublicNavbar } from '@/components/PublicNavbar'

export default function HomePage() {
  const { data: session, status } = useSession()

  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [activeLang, setActiveLang] = useState('')
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isAuthenticated = status === 'authenticated'
  const token = (session as any)?.accessToken

  const loadSnippets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSnippets({ search, tag: activeTag, language: activeLang }, token)
      setSnippets(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [token, search, activeTag, activeLang])

  useEffect(() => {
    getTags(token).then(setTags).catch(console.error)
  }, [token])

  useEffect(() => {
    const t = setTimeout(loadSnippets, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [loadSnippets, search])

  async function handleSave(data: Partial<Snippet>) {
    if (!token) return
    if (editingSnippet?.id) {
      const updated = await updateSnippet(editingSnippet.id, data, token)
      setSnippets(prev => prev.map(s => s.id === updated.id ? updated : s))
    } else {
      const created = await createSnippet(data, token)
      setSnippets(prev => [created, ...prev])
    }
  }

  async function handleDelete() {
    if (!deletingId || !token) return
    setDeleteLoading(true)
    try {
      await deleteSnippet(deletingId, token)
      setSnippets(prev => prev.filter(s => s.id !== deletingId))
    } finally {
      setDeleteLoading(false)
      setDeletingId(null)
    }
  }

  function clearFilters() {
    setSearch('')
    setActiveTag('')
    setActiveLang('')
  }

  const hasFilters = search || activeTag || activeLang
  const currentUserId = (session?.user as any)?.id || ''
  const isAdmin = (session?.user as any)?.role === 'admin'

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {isAuthenticated ? (
        <Navbar
          userName={session?.user?.name || 'User'}
          userRole={isAdmin ? 'admin' : 'member'}
          onAddSnippet={() => setEditingSnippet(null)}
        />
      ) : (
        <PublicNavbar />
      )}

      <main className="max-w-7xl mx-auto px-5 py-8">
        {/* Page heading */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Code Library
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            {snippets.length} snippet{snippets.length !== 1 ? 's' : ''} · {isAuthenticated ? 'shared across your team' : 'browse our public code collection'}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 mb-6 animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '38px', paddingRight: search ? '36px' : '14px', fontSize: '14px', height: '42px' }}
              placeholder="Search by title, description or code…"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag + Language filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-medium mr-1" style={{ color: 'var(--text-3)' }}>
              <SlidersHorizontal size={11} /> Filter:
            </span>

            {/* Language filter */}
            {LANGUAGES.map(lang => (
              <button
                key={lang.value}
                onClick={() => setActiveLang(activeLang === lang.value ? '' : lang.value)}
                className="tag-pill"
                style={{
                  background: activeLang === lang.value ? `${lang.color}20` : 'var(--bg-2)',
                  color: activeLang === lang.value ? lang.color : 'var(--text-2)',
                  border: `1px solid ${activeLang === lang.value ? lang.color + '40' : 'var(--border)'}`,
                }}
              >
                {lang.label}
              </button>
            ))}

            <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px' }} />

            {/* Tag filter */}
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.name ? '' : tag.name)}
                className="tag-pill"
                style={{
                  background: activeTag === tag.name ? `${tag.color}20` : 'var(--bg-2)',
                  color: activeTag === tag.name ? tag.color : 'var(--text-2)',
                  border: `1px solid ${activeTag === tag.name ? tag.color + '40' : 'var(--border)'}`,
                }}
              >
                {tag.name}
              </button>
            ))}

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="tag-pill"
                style={{ background: 'rgba(255,95,114,0.1)', color: 'var(--red)', border: '1px solid rgba(255,95,114,0.2)' }}
              >
                <X size={10} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 size={28} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Loading snippets…</p>
            </div>
          </div>
        ) : snippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <Code2 size={22} style={{ color: 'var(--text-3)' }} />
            </div>
            <p className="font-medium" style={{ color: 'var(--text-2)' }}>
              {hasFilters ? 'No snippets match your filters' : 'No snippets yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
              {hasFilters
                ? 'Try clearing your filters or search'
                : isAuthenticated ? 'Add your first snippet to get started' : 'Check back later for new content'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost mt-4" style={{ fontSize: '13px' }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
            {snippets.map(snippet => (
              isAuthenticated ? (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={s => setEditingSnippet(s)}
                  onDelete={id => setDeletingId(id)}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ) : (
                <PublicSnippetCard key={snippet.id} snippet={snippet} />
              )
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal - only for authenticated users */}
      {isAuthenticated && editingSnippet !== undefined && (
        <SnippetModal
          snippet={editingSnippet}
          tags={tags}
          onSave={handleSave}
          onClose={() => setEditingSnippet(undefined)}
        />
      )}

      {/* Delete Confirm - only for authenticated users */}
      {isAuthenticated && deletingId && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
