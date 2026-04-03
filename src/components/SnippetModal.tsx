'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { X, Save, Tag, Plus } from 'lucide-react'
import { Snippet, Tag as TagType, LANGUAGES } from '@/types'

// Load Monaco client-side only
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  snippet?: Snippet | null
  tags: TagType[]
  onSave: (data: Partial<Snippet>) => Promise<void>
  onClose: () => void
}

export function SnippetModal({ snippet, tags, onSave, onClose }: Props) {
  const [title, setTitle] = useState(snippet?.title || '')
  const [description, setDescription] = useState(snippet?.description || '')
  const [code, setCode] = useState(snippet?.code || '')
  const [language, setLanguage] = useState(snippet?.language || 'php')
  const [selectedTags, setSelectedTags] = useState<string[]>(snippet?.tags || [])
  const [workingPages, setWorkingPages] = useState(snippet?.working_pages || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!title.trim() || !code.trim()) {
      setError('Title and code are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ title, description, code, language, tags: selectedTags, working_pages: workingPages })
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function toggleTag(name: string) {
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
            {snippet ? 'Edit Snippet' : 'Add New Snippet'}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-lg text-sm"
              style={{ background: 'rgba(255,95,114,0.1)', border: '1px solid rgba(255,95,114,0.2)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          {/* Title + Language row */}
          <div className="grid grid-cols-[1fr,160px] gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-2)' }}>
                Title <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input"
                placeholder="e.g. CSS line clamp 2 lines"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-2)' }}>
                Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="input"
                style={{ cursor: 'pointer' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-2)' }}>
              Description
            </label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input"
              placeholder="Brief description of what this does"
            />
          </div>

          {/* Code editor */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-2)' }}>
              Code <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '9px',
              overflow: 'hidden',
              height: '280px',
            }}>
              <MonacoEditor
                height="280px"
                language={language === 'javascript' ? 'javascript' : language}
                value={code}
                onChange={v => setCode(v || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'DM Mono', monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'gutter',
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>
              <Tag size={12} /> Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const active = selectedTags.includes(tag.name)
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className="tag-pill"
                    style={{
                      background: active ? `${tag.color}20` : 'var(--bg-2)',
                      color: active ? tag.color : 'var(--text-2)',
                      border: `1px solid ${active ? tag.color + '40' : 'var(--border)'}`,
                    }}
                  >
                    {active && <span>✓ </span>}{tag.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Working pages */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-2)' }}>
              Working Pages (optional)
            </label>
            <input
              value={workingPages}
              onChange={e => setWorkingPages(e.target.value)}
              className="input"
              placeholder="e.g. post detail page, listing page"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : (snippet ? 'Save Changes' : 'Add Snippet')}
          </button>
        </div>
      </div>
    </div>
  )
}
