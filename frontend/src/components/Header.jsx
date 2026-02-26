import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
      {initials}
    </div>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dashPath = user?.role === 'Teacher' ? '/teacher' : user?.role === 'Mentor' ? '/mentor' : '/student'
  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={10} />
          <span className="font-semibold tracking-tight">SmartMark</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-purple-400 transition-all duration-300">Home</Link>
          <Link to={dashPath} className="hover:text-purple-400 transition-all duration-300">Dashboard</Link>
          <Link to="/about" className="hover:text-purple-400 transition-all duration-300">About</Link>
          <Link to="/contact" className="hover:text-purple-400 transition-all duration-300">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Avatar name={user.name} />
                <div className="text-sm">
                  <div className="leading-tight">{user.name}</div>
                  <div className="text-xs text-gray-300">{user.role}</div>
                </div>
              </div>
              <button onClick={() => { logout(); navigate('/login') }} className="gradient-btn px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="gradient-btn px-4 py-2">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
