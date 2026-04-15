'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { X, Copy, Check, FileCode2, Globe, User, Clock, Tag } from 'lucide-react'
import { Snippet } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// Load Monaco client-side only
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  snippet: Snippet
  onClose: () => void
}

export function ViewModal({ snippet, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="tag-pill flex items-center gap-1" style={{
                background: 'var(--bg-3)',
                color: 'var(--text-2)',
                border: '1px solid var(--border)',
              }}>
                <FileCode2 size={11} />
                {snippet.language.toUpperCase()}
              </span>
              {snippet.tags.map(tag => (
                <span key={tag} className="tag-pill" style={{
                  background: 'var(--bg-3)',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)',
                }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
              {snippet.title}
            </h2>
            {snippet.description && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                {snippet.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className="btn-ghost"
              style={{ padding: '7px 12px', fontSize: '13px', gap: '5px' }}
            >
              {copied
                ? <><Check size={14} style={{ color: 'var(--green)' }} /> Copied</>
                : <><Copy size={14} /> Copy</>
              }
            </button>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '6px 8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Code viewer */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '9px',
            overflow: 'hidden',
            height: '400px',
          }}>
            <MonacoEditor
              height="400px"
              language={snippet.language === 'javascript' ? 'javascript' : snippet.language}
              value={snippet.code}
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
                readOnly: true,
              }}
            />
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-4">
              {snippet.working_pages && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
                  <Globe size={12} />
                  {snippet.working_pages}
                </span>
              )}
              {snippet.created_by_name && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
                  <User size={12} />
                  {snippet.updated_by_name || snippet.created_by_name}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
              <Clock size={12} />
              {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
