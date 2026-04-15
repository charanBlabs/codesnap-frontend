'use client'
import { useState } from 'react'
import { Copy, Check, Edit2, Trash2, Globe, User, Clock, FileCode2 } from 'lucide-react'
import { Snippet } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onView?: (snippet: Snippet) => void
  currentUserId: string
  isAdmin: boolean
  readOnly?: boolean
}

export function SnippetCard({ snippet, onEdit, onDelete, onView, currentUserId, isAdmin, readOnly }: Props) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const canEdit = isAdmin || snippet.created_by === currentUserId

  async function copy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCardClick() {
    if (readOnly && onView) {
      onView(snippet)
    } else if (canEdit) {
      onEdit(snippet)
    }
  }

  const codePreview = expanded ? snippet.code : snippet.code.split('\n').slice(0, 8).join('\n')
  const hasMore = snippet.code.split('\n').length > 8

  return (
    <div 
      className="card flex flex-col cursor-pointer" 
      style={{ padding: '0' }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Tags only */}
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
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
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>
            {snippet.title}
          </h3>
          {snippet.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-2)' }}>
              {snippet.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={copy}
            className="btn-ghost"
            style={{ padding: '7px 10px', fontSize: '12px', gap: '5px' }}
            title="Copy code"
          >
            {copied
              ? <><Check size={13} style={{ color: 'var(--green)' }} /> Copied</>
              : <><Copy size={13} /> Copy</>
            }
          </button>
          {canEdit && !readOnly && (
            <>
              <button
                onClick={() => onEdit(snippet)}
                className="btn-ghost"
                style={{ padding: '7px 9px' }}
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(snippet.id)}
                className="btn-ghost"
                style={{ padding: '7px 9px', color: 'var(--red)' }}
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code block */}
      <div className="px-5 pb-3">
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 14px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#c4cde0',
          overflow: 'hidden',
          maxHeight: expanded ? '600px' : '180px',
          transition: 'max-height 0.3s ease',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          position: 'relative',
        }}>
          {codePreview}
          {!expanded && hasMore && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
              background: 'linear-gradient(transparent, var(--bg))',
            }} />
          )}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs mt-1.5"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
          >
            {expanded ? '↑ Show less' : `↓ Show all ${snippet.code.split('\n').length} lines`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div className="flex items-center gap-3">
          {snippet.working_pages && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
              <Globe size={11} />
              {snippet.working_pages}
            </span>
          )}
          {snippet.created_by_name && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
              <User size={11} />
              {snippet.updated_by_name || snippet.created_by_name}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
          <Clock size={11} />
          {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
