'use client'
import { AlertTriangle } from 'lucide-react'

interface Props {
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirmModal({ onConfirm, onCancel, loading }: Props) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal-box" style={{ maxWidth: '420px' }}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,95,114,0.1)', border: '1px solid rgba(255,95,114,0.2)' }}>
            <AlertTriangle size={22} style={{ color: 'var(--red)' }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Delete Snippet?</h3>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            This action cannot be undone. The snippet will be permanently removed.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-primary flex-1 justify-center"
              style={{ background: 'var(--red)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
