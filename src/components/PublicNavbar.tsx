'use client'
import { useSession, signOut } from 'next-auth/react'
import { Code2, LogIn, LogOut, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function PublicNavbar() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const isAdmin = session?.user?.role === 'admin'

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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/" className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}>
                <Plus size={14} />
                Add Snippet
              </Link>
              {isAdmin && (
                <Link href="/admin/users" className="btn-ghost" style={{ padding: '7px 12px', fontSize: '13px' }}>
                  <Users size={13} />
                  Users
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost"
                style={{ padding: '7px 12px', fontSize: '13px' }}
              >
                <LogOut size={14} />
                Sign out
              </button>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid rgba(108,114,255,0.3)' }}>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}>
              <LogIn size={14} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
