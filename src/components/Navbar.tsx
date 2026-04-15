'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Code2, LogOut, Users, ChevronDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  userName: string
  userRole: string
  onAddSnippet: () => void
}

export function Navbar({ userName, userRole, onAddSnippet }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="glass sticky top-0 z-40" style={{ borderBottom: '1px solid var(--border)', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-glow)', border: '1px solid rgba(108,114,255,0.3)' }}>
            <Code2 size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
            CodeSnap
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button onClick={onAddSnippet} className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}>
            <Plus size={14} />
            Add Snippet
          </button>

          {userRole === 'admin' && (
            <Link href="/admin/users" className="btn-ghost" style={{ padding: '7px 12px', fontSize: '13px' }}>
              <Users size={13} />
              Users
            </Link>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 btn-ghost"
              style={{ padding: '6px 10px', fontSize: '13px' }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid rgba(108,114,255,0.3)' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block">{userName}</span>
              <ChevronDown size={12} style={{ opacity: 0.5 }} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>{userName}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                    {userRole === 'admin' ? '👑 Admin' : 'Member'}
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors"
                  style={{ color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
