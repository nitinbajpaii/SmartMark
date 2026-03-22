import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

const iconMap = {
  Dashboard: LayoutDashboard,
}

const linksByRole = {
  Student: [{ to: '/student', label: 'Dashboard' }],
  Teacher: [{ to: '/teacher', label: 'Dashboard' }],
  Mentor:  [{ to: '/mentor', label: 'Dashboard' }],
}

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-glow shrink-0">
      {initials}
    </div>
  )
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const links = user ? linksByRole[user.role] || [] : []

  return (
    <aside className="flex flex-col h-full p-4 gap-4">
      {/* User info */}
      {user && (
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm text-white truncate">{user.name}</div>
            <div className="text-xs text-gray-400 truncate">{user.role}</div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">Navigation</p>
        {links.map(l => {
          const Icon = iconMap[l.label] || LayoutDashboard
          const active = location.pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/25 text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-purple-400' : 'text-gray-500'}`} />
              {l.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout button */}
      {user && (
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      )}
    </aside>
  )
}
