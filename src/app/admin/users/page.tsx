'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Crown, User as UserIcon, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { User } from '@/types'
import { getUsers, createUser, deleteUser } from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'member' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = (session?.user as any)?.role === 'admin'
  const token = (session as any)?.accessToken

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && !isAdmin) router.push('/')
  }, [status, isAdmin, router])

  useEffect(() => {
    if (!token || !isAdmin) return
    getUsers(token).then(setUsers).finally(() => setLoading(false))
  }, [token, isAdmin])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError('')
    try {
      const user = await createUser(form, token)
      setUsers(prev => [user, ...prev])
      setForm({ email: '', name: '', password: '', role: 'member' })
      setShowForm(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!token || !confirm('Remove this user?')) return
    await deleteUser(id, token)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  if (loading || status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm mb-6 btn-ghost" style={{ width: 'fit-content' }}>
          <ArrowLeft size={14} /> Back to Library
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Team Members</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{users.length} users</p>
          </div>
          <button onClick={() => setShowForm(s => !s)} className="btn-primary">
            <Plus size={14} /> Add Member
          </button>
        </div>

        {/* Add user form */}
        {showForm && (
          <div className="card p-5 mb-5 animate-fade-up">
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>New Team Member</h3>
            {error && (
              <div className="p-3 rounded-lg text-sm mb-4"
                style={{ background: 'rgba(255,95,114,0.1)', border: '1px solid rgba(255,95,114,0.2)', color: 'var(--red)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required placeholder="Full name" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>Email</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required placeholder="email@team.com" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>Password</label>
                <input className="input" type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required placeholder="Temp password" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-2)' }}>Role</label>
                <select className="input" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="flex flex-col gap-3">
          {users.map(user => (
            <div key={user.id} className="card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                  style={{ background: user.role === 'admin' ? 'rgba(108,114,255,0.15)' : 'var(--bg-2)',
                    color: user.role === 'admin' ? 'var(--accent)' : 'var(--text-2)',
                    border: `1px solid ${user.role === 'admin' ? 'rgba(108,114,255,0.3)' : 'var(--border)'}` }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
                        <Crown size={10} /> Admin
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                  Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </span>
                {user.id !== (session?.user as any)?.id && (
                  <button onClick={() => handleDelete(user.id)} className="btn-ghost" style={{ padding: '6px 8px', color: 'var(--red)' }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
