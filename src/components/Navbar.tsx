'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/calculator', label: 'Calculator', icon: '🧮' },
    { href: '/dashboard', label: 'Saved Scenarios', icon: '💾' },
  ]

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/calculator" className="text-lg font-black text-white tracking-tight">
          🏠 HomeCalc
        </Link>
        <div className="hidden sm:flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                pathname === link.href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="text-xs text-slate-400 hidden sm:block max-w-[120px] truncate">
            {user?.user_metadata?.full_name || user?.email}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-slate-700">
              <div className="text-xs font-semibold text-white truncate">
                {user?.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
            </div>
            <div className="sm:hidden py-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-slate-700 transition"
            >
              🚪 Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
