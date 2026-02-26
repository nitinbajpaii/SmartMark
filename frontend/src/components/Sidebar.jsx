import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

const linksByRole = {
  Student: [{ to: '/student', label: 'Dashboard' }],
  Teacher: [{ to: '/teacher', label: 'Dashboard' }],
  Mentor: [{ to: '/mentor', label: 'Dashboard' }]
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const links = user ? linksByRole[user.role] || [] : []

  return (
    <aside className="flex flex-col m-4 lg:m-6 p-6 h-[calc(100vh-88px)] lg:h-[calc(100vh-48px)] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Logo size={10} />
        <div className="font-semibold text-lg">SmartMark</div>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${location.pathname===l.to ? 'bg-white/20 shadow-glow' : 'hover:bg-white/10'}`}
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
      {user && (
        <div className="mt-auto">
          <button onClick={logout} className="w-full gradient-btn px-4 py-3">
            Logout
          </button>
        </div>
      )}
    </aside>
  )
}
